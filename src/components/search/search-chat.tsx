"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Send, Loader2, BookOpen, Copy, Filter, Check, Edit2, Trash2, History, Plus, X, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearch } from "./search-context"

type SourceFilter = "ALL" | "BIBLE" | "LE_MESSAGE"

export function SearchChat() {
  const {
    messages, setMessages, clearMessages,
    conversations, loadConversation, deleteConversation, startNewConversation
  } = useSearch()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("ALL")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editingId && editTextareaRef.current) {
      editTextareaRef.current.focus()
    }
  }, [editingId])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120)
      textareaRef.current.style.height = newHeight + "px"
    }
  }, [input])

  const handleSubmit = async (e?: React.FormEvent, directInput?: string) => {
    if (e) e.preventDefault()
    const inputToUse = directInput ?? input
    const trimmedInput = inputToUse?.trim() || ""
    if (!trimmedInput || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: trimmedInput,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage = {
      id: assistantMessageId,
      type: "assistant" as const,
      content: "",
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedInput,
          sources: sourceFilter !== "ALL" ? [sourceFilter] : undefined
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur de recherche")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Impossible de lire la réponse")

      let accumulatedContent = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n").filter(Boolean)

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.content) {
              accumulatedContent += data.content
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulatedContent }
                    : m
                )
              )
            }
          } catch (e) {
            console.error("Erreur parsing chunk:", e)
          }
        }
      }
    } catch (error: any) {
      console.error("Search error:", error)
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessageId
            ? { ...m, content: "Désolé, une erreur est survenue lors de la recherche." }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(undefined, suggestion)
  }

  const handleEditClick = (message: { id: string, content: string }) => {
    setEditingId(message.id)
    setEditContent(message.content)
  }

  const handleSaveEdit = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, content: editContent } : m)
    )
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent, messageId: string) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveEdit(messageId)
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  const suggestions = [
    "Qu'est-ce que la foi ?",
    "La semence du serpent",
    "Le baptême au nom de Jésus",
    "La divinité de Jésus-Christ",
    "Les sept sceaux",
    "La vie après la mort"
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="flex h-[calc(100vh-130px)] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
      {/* Panneau Historique */}
      {showHistory && (
        <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 animate-in slide-in-from-left duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <History className="h-4 w-4 text-blue-600" />
              Historique
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-3 py-2">
            <button
              onClick={() => { startNewConversation(); setShowHistory(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
            >
              <Plus className="h-4 w-4" />
              Nouvelle conversation
            </button>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium tracking-tight">Aucun historique</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "group flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-all",
                    "hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm",
                  )}
                >
                  <button
                    onClick={() => { loadConversation(conv.id); setShowHistory(false) }}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-sm text-slate-700 font-medium truncate group-hover:text-slate-900 transition-colors">
                      {conv.title}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      {formatDate(conv.updatedAt)} • {conv.messages.filter(m => m.type === "user").length} msg
                    </p>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Zone principale du chat */}
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        {/* Messages Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6">
              <div className="max-w-3xl w-full">
                <div className="mb-10 text-center space-y-4">
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto shadow-sm">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Recherche Biblique Assistée par IA
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto mt-2 font-medium">
                      Posez des questions, recherchez des thèmes ou des passages spécifiques dans la Bible et les enseignements de William Branham.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm group"
                    >
                      <p className="text-slate-600 font-medium text-sm group-hover:text-blue-600 transition-colors">{suggestion}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6">
              {/* Header avec bouton Nouvelle conversation */}
              <div className="flex justify-end pt-4 pb-2 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                <button
                  onClick={clearMessages}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded-lg hover:border-blue-200 transition-colors shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Nouvelle conversation
                </button>
              </div>

              <div className="max-w-4xl mx-auto w-full pb-10 space-y-8">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    {message.type === "user" ? (
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-2xl px-5 py-3 max-w-2xl shadow-lg shadow-blue-100">
                          <p className="text-[15px] leading-relaxed font-medium">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 max-w-2xl shadow-sm relative overflow-hidden group">
                          {editingId === message.id ? (
                            <div className="space-y-4">
                              <textarea
                                ref={editTextareaRef}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onKeyDown={(e) => handleEditKeyDown(e, message.id)}
                                className="w-full min-h-[150px] p-4 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(message.id)}
                                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                  Enregistrer
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 text-xs font-bold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="prose prose-slate prose-sm max-w-none">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-slate-700 text-[15px] font-medium">{children}</p>,
                                    ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2 text-slate-600">{children}</ul>,
                                    ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2 text-slate-600">{children}</ol>,
                                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                    strong: ({ children }) => <strong className="font-bold text-slate-900 bg-blue-50 px-1 rounded">{children}</strong>,
                                    em: ({ children }) => <em className="italic text-slate-800">{children}</em>,
                                    blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-500 my-4 bg-white py-2 rounded-r-lg">{children}</blockquote>,
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                              {message.content && (
                                <div className="flex gap-4 mt-6 pt-4 border-t border-slate-200">
                                  <button
                                    onClick={() => navigator.clipboard.writeText(message.content)}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                    Copier
                                  </button>
                                  <button
                                    onClick={() => handleEditClick(message)}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                    Modifier
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 animate-pulse" />
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recherche IA...</p>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 py-6 border-t border-slate-200 bg-white relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-400 transition-all shadow-sm relative group">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez une question à Logos.rv..."
                  disabled={isLoading}
                  className="min-h-[60px] max-h-40 w-full resize-none border-0 bg-transparent px-5 py-5 text-[15px] font-medium placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-0 scrollbar-hide"
                  rows={1}
                />

                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-3">
                    {/* Bouton Historique */}
                    <button
                      type="button"
                      onClick={() => setShowHistory(!showHistory)}
                      className={cn(
                        "h-9 px-4 flex items-center gap-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all",
                        showHistory
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                          : "border-slate-200 text-slate-500 hover:bg-white hover:text-slate-900"
                      )}
                    >
                      <History className="h-3.5 w-3.5" />
                      Historique
                      {conversations.length > 0 && (
                        <span className={cn("ml-1 px-1.5 py-0.5 text-[9px] rounded-full border", showHistory ? "bg-white/20 border-white/30 text-white" : "bg-slate-200 text-slate-500 border-slate-300")}>
                          {conversations.length}
                        </span>
                      )}
                    </button>

                    {/* Source Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-2 px-4 border-slate-200 bg-white text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 rounded-lg shadow-sm"
                        >
                          <Filter className="h-3.5 w-3.5" />
                          {sourceFilter === "ALL" && "Toutes sources"}
                          {sourceFilter === "BIBLE" && "Bible"}
                          {sourceFilter === "LE_MESSAGE" && "Le Message"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[180px] bg-white border-slate-200 text-slate-900 p-2 rounded-xl shadow-2xl">
                        <DropdownMenuItem
                          onClick={() => setSourceFilter("ALL")}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg py-2"
                        >
                          <Check className={cn("h-3.5 w-3.5 text-blue-600", sourceFilter === "ALL" ? "opacity-100" : "opacity-0")} />
                          <span className="text-xs font-medium">Toutes sources</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSourceFilter("BIBLE")}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg py-2"
                        >
                          <Check className={cn("h-3.5 w-3.5 text-blue-600", sourceFilter === "BIBLE" ? "opacity-100" : "opacity-0")} />
                          <span className="text-xs font-medium">Bible uniquement</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSourceFilter("LE_MESSAGE")}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg py-2"
                        >
                          <Check className={cn("h-3.5 w-3.5 text-blue-600", sourceFilter === "LE_MESSAGE" ? "opacity-100" : "opacity-0")} />
                          <span className="text-xs font-medium">Le Message</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-lg",
                      isLoading || !input.trim()
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-200'
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
