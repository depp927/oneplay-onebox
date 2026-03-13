import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Lightbulb, Code, BookOpen, Zap } from "lucide-react"
import { searchOneChainKnowledge } from "@/lib/chat-ai"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string // Changed to string to avoid hydration issues
  suggestions?: string[]
}

interface ChatSectionProps {
  className?: string
}

export function ChatSection({ className }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hello! I'm your OneChain AI assistant. I can help you with:\n\n• OneChain blockchain development\n• Move programming language\n• PTB (Programmable Transaction Blocks)\n• Smart contract deployment\n• Wallet integration\n• Developer tools and SDK usage\n\nWhat would you like to know about OneChain?",
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp: string) => {
    // Client-side only formatting to avoid hydration issues
    if (typeof window === 'undefined') return ''
    
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

    // Placeholder ID for the assistant's streaming message
    const assistantMessageId = (Date.now() + 1).toString();
    const startTimeResult = new Date().toISOString();

    // Create an initial empty assistant message to show we are "thinking" or starting to stream
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      content: '', // Start empty
      role: 'assistant',
      timestamp: startTimeResult,
    }]);

    try {
      // Search OneChain knowledge base and generate response
      console.log('Sending request to searchOneChainKnowledge...');
      
      const onStream = (chunk: string) => {
        // Update the streaming message content
        setMessages(prev => {
            const newMessages = [...prev]
            const msgIndex = newMessages.findIndex(m => m.id === assistantMessageId)
            if (msgIndex !== -1) {
                // Determine if we are streaming the "suggestions block" to hide it?
                // For simplicity, just append. If it contains suggestions block, we will clean it up at the end.
                newMessages[msgIndex] = {
                    ...newMessages[msgIndex],
                    content: newMessages[msgIndex].content + chunk
                }
            }
            return newMessages
        })
      };

      const response = await searchOneChainKnowledge(input.trim(), onStream);
      
      // Final update with clean answer and suggestions
      setMessages(prev => {
          const newMessages = [...prev]
          const msgIndex = newMessages.findIndex(m => m.id === assistantMessageId)
          if (msgIndex !== -1) {
              newMessages[msgIndex] = {
                  ...newMessages[msgIndex],
                  content: response.answer, // Clean answer
                  suggestions: response.suggestions
              }
          }
          return newMessages
      })

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

  const formatContent = (content: string) => {
    // Simple formatting for code blocks and bullet points
    return content.split('\n').map((line, index) => {
      if (line.trim().startsWith('```')) {
        return null // Handle code blocks separately if needed
      }
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} className="flex items-start gap-2 my-1">
            <span className="text-blue-500 mt-1">•</span>
            <span>{line.trim().substring(1).trim()}</span>
          </div>
        )
      }
      if (line.trim().startsWith('#')) {
        return (
          <h3 key={index} className="font-semibold text-lg mt-3 mb-1 text-blue-600 dark:text-blue-400">
            {line.trim().substring(1).trim()}
          </h3>
        )
      }
      return line.trim() ? (
        <p key={index} className="mb-2">{line}</p>
      ) : (
        <br key={index} />
      )
    })
  }

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          OneChain AI Assistant
          <Badge variant="secondary" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}>
                      <div className="text-sm">
                        {message.role === 'assistant' ? formatContent(message.content) : message.content}
                      </div>
                    </div>
                    
                    <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {message.suggestions && message.role === 'assistant' && (
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Lightbulb className="h-3 w-3" />
                      Try asking:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-auto py-1 px-2 text-xs"
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about OneChain development, Move programming, PTBs..."
                className="min-h-[60px] max-h-[120px] resize-none pr-12"
                disabled={isLoading}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  OneChain AI
                </Badge>
              </div>
            </div>
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <BookOpen className="h-3 w-3" />
            <span>Powered by OneChain documentation and developer guides</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
