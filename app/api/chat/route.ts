import { NextRequest, NextResponse } from 'next/server';
import { xai } from '@ai-sdk/xai';
import { streamText } from 'ai';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient, RedisClientType } from 'redis';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// ────────────────────────────────────────────────
// 配置常量
// ────────────────────────────────────────────────
const CACHE_TTL_SECONDS = 3600; // 缓存1小时，减少重复调用
const RATE_LIMIT_WINDOW_SECONDS = 10; // 限速窗口10秒
const RATE_LIMIT_MAX_REQUESTS = 5; // 每窗口最多5请求，防止滥用

// 本地文件路径（支持多个固定文件）
const LOCAL_CONTENT_FILES = [
  path.resolve(process.cwd(), 'data', 'onelabs.txt'),
  // 添加更多文件路径，如 'onelabs-api-reference.md'
];

// Redis 单例（本地连接）
let redisClient: RedisClientType | null = null;
let redisConnectionPromise: Promise<RedisClientType | null> | null = null;

async function getRedisClient(): Promise<RedisClientType | null> {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (!redisConnectionPromise) {
    redisConnectionPromise = (async () => {
      const client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 5000, // 5s timeout
          reconnectStrategy: false 
        }
      });
      client.on('error', (err) => console.error('Redis Client Error', err));
      try {
        await client.connect();
        redisClient = client as RedisClientType;
        return client as RedisClientType;
      } catch (error) {
        console.error('Failed to connect to Redis, proceeding without cache/ratelimit:', error);
        redisConnectionPromise = null;
        return null; // Fail gracefully
      }
    })();
  }
  
  return redisConnectionPromise;
}

// ────────────────────────────────────────────────
// 新增：读取多个本地文件并拼接内容
// ────────────────────────────────────────────────
async function tryReadMultipleLocalFiles(): Promise<string | null> {
  const contents: string[] = [];
  let successCount = 0;

  for (const filePath of LOCAL_CONTENT_FILES) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(process.cwd(), filePath);
      contents.push(`\n=== Content from local file: ${relativePath} ===\n${content.trim()}\n`);
      successCount++;
      console.log(`[Local File] Read success: ${relativePath}`);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        console.log(`[Local File] Not found: ${filePath}`);
      } else {
        console.error(`[Local File] Read error ${filePath}: ${err.message}`);
      }
    }
  }

  if (successCount === 0) {
    console.log('[Local Files] All files missing, fallback to tools');
    return null;
  }

  return contents.join('\n') + '\n\n';
}

// ────────────────────────────────────────────────
// 输入校验
// ────────────────────────────────────────────────
const MessageSchema = z.object({
  message: z.string().min(1).max(8000), // 限制输入长度，控制滥用
});

// ────────────────────────────────────────────────
// 缓存键生成（简单 hash）
// ────────────────────────────────────────────────
function generateCacheKey(message: string): string {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = (hash << 5) - hash + message.charCodeAt(i);
    hash |= 0; // 32bit int
  }
  return 'cache:' + Math.abs(hash).toString(36);
}

export async function POST(request: NextRequest) {
  try {
    // 1. 读取 & 校验输入
    const body = await request.json();
    const { message } = MessageSchema.parse(body);

    // 2. 检查 API Key
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'XAI_API_KEY not configured' }, { status: 500 });
    }

    // 3. Redis 连接 (Fail-safe)
    const redis = await getRedisClient();

    // 4. 速率限制 (Only if Redis is available)
    if (redis) {
        try {
            const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
            const rateKey = `ratelimit:${ip}`;
            let count = await redis.get(rateKey);
            let currentCount = count ? parseInt(count, 10) : 0;

            if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
            return NextResponse.json(
                {
                error: 'Rate limit exceeded',
                details: `Max ${RATE_LIMIT_MAX_REQUESTS} requests per ${RATE_LIMIT_WINDOW_SECONDS} seconds`,
                },
                { status: 429 }
            );
            }

            if (currentCount === 0) {
            await redis.set(rateKey, '1', { EX: RATE_LIMIT_WINDOW_SECONDS });
            } else {
            await redis.incr(rateKey);
            }
        } catch (e) {
            console.warn('Rate limiting failed:', e);
        }
    }

    // 5. 检查缓存
    const cacheKey = generateCacheKey(message);
    if (redis) {
        try {
            const cachedResponse = await redis.get(cacheKey);

            if (cachedResponse) {
                console.log(`Cache hit for key: ${cacheKey}`);
                return NextResponse.json(JSON.parse(cachedResponse));
            }
        } catch (e) {
            console.warn('Cache check failed:', e);
        }
    }

    // 6. 优先读取本地文件
    const localContent = await tryReadMultipleLocalFiles();
    // 7. 构建 system prompt（本地优先，引导工具使用）
    const systemPrompt = `You are a helpful OneChain blockchain development assistant.

You have access to the following context sources:

Local File Content (prioritize this if relevant):
${localContent || '[No local file content available]'}

Instructions:
1. FIRST, thoroughly search and use the Local File Content to answer if it contains relevant information.
2. If Local File Content is insufficient or irrelevant, then use tools like browse_page or web_search to fetch additional data from allowed domains (onelabs.cc, docs.onelabs.cc).
3. Answer STRICTLY based on the provided content or tool results. Do NOT use internal knowledge.
4. Prioritize explicit mentions in the content.
5. If no information found, say: "I don't have that specific information from the available sources."
6. When suggesting code, base it on patterns/examples from the content.
7. Be concise, use markdown for code blocks, explain reasoning.
8. VERY IMPORTANT: At the end of your response, generate 3 follow-up questions based on YOUR ANSWER.
   Format as: :::SUGGESTIONS::: ["Question 1?", "Question 2?", "Question 3?"] :::SUGGESTIONS:::

Current date: ${new Date().toISOString().split('T')[0]}
`;

    // 8. 调用 Grok（改为 streamText）
    const result = streamText({
      model: xai('grok-4-1-fast-reasoning'), // reasoning 模型高效
      system: systemPrompt,
      prompt: message,
      temperature: 0.3, // 低值减少幻觉/重试
      onChunk: ({ chunk }) => {
        if (chunk.type === 'text-delta') {
          // console.log(`[Stream Debug] Text delta received: "${chunk.text}"`);
        } else {
          // console.log(`[Stream Debug] Other chunk received: ${chunk.type}`);
          
        }
      },
      onFinish: async ({ text }) => {
        // 缓存处理逻辑移到这里
        const responseText = text || 'Sorry, I could not generate a meaningful response based on the provided context.';
         // Extract suggestions
        let finalResponse = responseText;
        let suggestions: string[] = [];
        
        const suggestionMatch = responseText.match(/:::SUGGESTIONS:::([\s\S]*?):::SUGGESTIONS:::/);
        if (suggestionMatch && suggestionMatch[1]) {
          try {
            suggestions = JSON.parse(suggestionMatch[1].trim());
            // Remove the suggestions block from the visible text (for cache)
            finalResponse = responseText.replace(suggestionMatch[0], '').trim();
          } catch (e) {
            console.error('Failed to parse suggestions JSON', e);
          }
        }

        // 8. 存储到缓存（设置 TTL）
        if (redis) {
            try {
                // Cache structure: stringified JSON of response + suggestions
                const cacheValue = JSON.stringify({ response: finalResponse, suggestions });
                await redis.set(cacheKey, cacheValue, { EX: CACHE_TTL_SECONDS });
                console.log(`Cache set for key: ${cacheKey}`);
            } catch (e) {
                console.warn('Failed to set cache:', e);
            }
        }
      }
    });

    return result.toTextStreamResponse({
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
        }
    });

  } catch (error) {
    console.error('API route error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to process request', details: msg },
      { status: 500 }
    );
  }
}