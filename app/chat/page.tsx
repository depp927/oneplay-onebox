"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Lightbulb, ArrowLeft, Zap, ArrowDown } from "lucide-react"
import Link from "next/link"
import { searchOneChainKnowledge } from "@/lib/chat-ai"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string // Changed to string to avoid hydration issues
  suggestions?: string[]
}

interface ChatPageProps {}

export default function ChatPage({}: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hello! I'm your OneChain AI assistant powered by Gork. I can help you with:\n\n• OneChain blockchain development\n• Move programming language\n• PTB (Programmable Transaction Blocks)\n• Smart contract deployment\n• Wallet integration\n• Developer tools and SDK usage\n\nWhat would you like to know about OneChain?",
      role: 'assistant',
      timestamp: new Date().toISOString(),
      suggestions: [
        "How do I create my first Move package?",
        "What are PTBs and how do I use them?",
        "How to connect a wallet to OneChain?",
        "Explain OneChain objects and ownership"
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setShouldAutoScroll(true)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShouldAutoScroll(isNearBottom)
  }

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom()
    }
  }, [messages])

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const formatTime = (timestamp: string) => {
    if (!hydrated) return ''
    
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShouldAutoScroll(true) // Enable auto-scroll when sending a message

    // Placeholder ID for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const startTimeResult = new Date().toISOString();

    // Create empty assistant message
    setMessages(prev => [...prev, {
        id: assistantMessageId,
        content: '',
        role: 'assistant',
        timestamp: startTimeResult,
    }]);

    try {
      const onStream = (chunk: string) => {
          setMessages(prev => {
              const newMessages = [...prev]
              const msgIndex = newMessages.findIndex(m => m.id === assistantMessageId)
              if (msgIndex !== -1) {
                  newMessages[msgIndex] = {
                      ...newMessages[msgIndex],
                      content: newMessages[msgIndex].content + chunk
                  }
              }
              return newMessages
          })
      };

      const response = await searchOneChainKnowledge(input.trim(), onStream)
      
      // Update with final formatted answer and suggestions
      setMessages(prev => {
          const newMessages = [...prev]
          const msgIndex = newMessages.findIndex(m => m.id === assistantMessageId)
          if (msgIndex !== -1) {
                newMessages[msgIndex] = {
                    ...newMessages[msgIndex],
                    content: response.answer,
                    suggestions: response.suggestions
                }
          }
          return newMessages
      });

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try asking about OneChain development, Move programming, or PTBs in a different way.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    textareaRef.current?.focus()
  }

  const renderFormattedText = (text: string) => {
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  const formatContent = (content: string) => {
    const lines = content.split('\n')
    const elements = []
    let currentElement = []
    let inCodeBlock = false
    let codeLanguage = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={elements.length} className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto my-2 w-full max-w-full">
              <code className={`language-${codeLanguage} text-xs leading-relaxed block whitespace-pre-wrap`}>
                {currentElement.join('\n')}
              </code>
            </pre>
          )
          currentElement = []
          inCodeBlock = false
          codeLanguage = ''
        } else {
          // Start code block
          if (currentElement.length > 0) {
            elements.push(
              <div key={elements.length} className="mb-3">
                {currentElement.map((text, idx) => (
                  <p key={idx} className="mb-2">{renderFormattedText(text)}</p>
                ))}
              </div>
            )
            currentElement = []
          }
          inCodeBlock = true
          codeLanguage = line.replace('```', '')
        }
        continue
      }

      if (inCodeBlock) {
        currentElement.push(line)
      } else if (line.startsWith('# ')) {
        if (currentElement.length > 0) {
          elements.push(
            <div key={elements.length} className="mb-3">
              {currentElement.map((text, idx) => (
                <p key={idx} className="mb-2">{text}</p>
              ))}
            </div>
          )
          currentElement = []
        }
        elements.push(
          <h1 key={elements.length} className="font-bold text-xl mt-6 mb-3 text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-600 pb-2">
            {line.replace('# ', '')}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        if (currentElement.length > 0) {
          elements.push(
            <div key={elements.length} className="mb-3">
              {currentElement.map((text, idx) => (
                <p key={idx} className="mb-2">{text}</p>
              ))}
            </div>
          )
          currentElement = []
        }
        elements.push(
          <h2 key={elements.length} className="font-semibold text-lg mt-4 mb-2 text-blue-600 dark:text-blue-400">
            {line.replace('## ', '')}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        if (currentElement.length > 0) {
          elements.push(
            <div key={elements.length} className="mb-3">
              {currentElement.map((text, idx) => (
                <p key={idx} className="mb-2">{text}</p>
              ))}
            </div>
          )
          currentElement = []
        }
        elements.push(
          <h3 key={elements.length} className="font-medium text-base mt-3 mb-2 text-blue-600 dark:text-blue-400">
            {line.replace('### ', '')}
          </h3>
        )
      } else if (line.startsWith('• ')) {
        if (currentElement.length > 0 && !currentElement[currentElement.length - 1]?.startsWith('• ')) {
          elements.push(
            <div key={elements.length}>
              {currentElement.map((text, idx) => (
                <p key={idx} className="mb-2">{text}</p>
              ))}
            </div>
          )
          currentElement = []
        }
        currentElement.push(line)
      } else if (line.trim() === '') {
        if (currentElement.length > 0) {
          if (currentElement.some(item => item.startsWith('• '))) {
            elements.push(
              <ul key={elements.length} className="list-none space-y-1 my-2">
                {currentElement.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {renderFormattedText(item.replace('• ', ''))}
                  </li>
                ))}
              </ul>
            )
          } else {
            elements.push(
              <div key={elements.length} className="mb-3">
                {currentElement.map((text, idx) => (
                  <p key={idx} className="mb-2">{renderFormattedText(text)}</p>
                ))}
              </div>
            )
          }
          currentElement = []
        }
      } else {
        // Handle inline formatting like **bold** and *italic*
        let formattedLine = line
        
        // Handle bold text **text**
        formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Handle italic text *text*
        formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Handle inline code `code`
        formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>')
        
        currentElement.push(formattedLine)
      }
    }

    if (currentElement.length > 0) {
      if (inCodeBlock) {
        elements.push(
          <pre key={elements.length} className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto my-2 w-full max-w-full">
            <code className={`language-${codeLanguage} text-xs leading-relaxed block whitespace-pre-wrap`}>
              {currentElement.join('\n')}
            </code>
          </pre>
        )
      } else if (currentElement.some(item => item.startsWith('• '))) {
        elements.push(
          <ul key={elements.length} className="list-none space-y-1 my-2">
            {currentElement.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                {renderFormattedText(item.replace('• ', ''))}
              </li>
            ))}
          </ul>
        )
      } else {
        elements.push(
          <div key={elements.length} className="mb-3">
            {currentElement.map((text, idx) => (
              <p key={idx} className="mb-2">{renderFormattedText(text)}</p>
            ))}
          </div>
        )
      }
    }

    return <div className="space-y-2 w-full overflow-hidden">{elements}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  OneChain AI Assistant
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Powered by ChatGPT</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
<Card className="flex flex-col shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
          <CardHeader className="flex-shrink-0 pb-4 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Chat with OneChain AI
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 relative">
            {/* Scroll to bottom button */}
            {!shouldAutoScroll && (
              <Button
                onClick={scrollToBottom}
                size="sm"
                className="absolute bottom-20 right-6 z-10 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
            
            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-6 scroll-smooth"
              onScroll={handleScroll}
            >
              <div className="space-y-6 py-4 pb-8">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={`flex-1 ${message.role === 'user' ? 'text-right flex justify-end' : 'max-w-[85%]'}`}>
                        <div className={`rounded-xl px-4 py-3 shadow-sm border overflow-hidden ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white max-w-[85%] border-blue-600'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 w-full'
                        }`}>
                          <div className="text-sm leading-relaxed break-words overflow-hidden">
                            {message.role === 'assistant' ? formatContent(message.content) : message.content}
                          </div>
                        </div>
                        
                        <div className={`text-xs text-slate-500 dark:text-slate-400 mt-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.role === 'assistant' && (
                      <div className="ml-11 space-y-2 mt-3 max-w-[85%]">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Lightbulb className="h-3 w-3" />
                          Try asking:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-auto py-1.5 px-3 text-xs leading-tight text-left whitespace-normal break-words"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex gap-3">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask me anything about OneChain development..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[48px] max-h-32 resize-none border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() || isLoading}
                  className="self-end bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  size="lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
