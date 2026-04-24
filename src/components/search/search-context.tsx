"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  sources?: {
    title: string
    source: string
    reference?: string
    content: string
    chunkIndex?: number
  }[]
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface SearchContextType {
  messages: Message[]
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void
  addMessage: (message: Message) => void
  clearMessages: () => void
  conversations: Conversation[]
  currentConversationId: string | null
  loadConversation: (id: string) => void
  deleteConversation: (id: string) => void
  startNewConversation: () => void
}

const STORAGE_KEY = "logos-search-messages"
const HISTORY_KEY = "logos-search-history"

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [messages, setMessagesState] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Charger depuis localStorage au montage
  useEffect(() => {
    try {
      // Charger les conversations
      const storedHistory = localStorage.getItem(HISTORY_KEY)
      if (storedHistory) {
        setConversations(JSON.parse(storedHistory))
      }

      // Charger la conversation en cours
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.messages) {
          setMessagesState(parsed.messages)
          setCurrentConversationId(parsed.conversationId || null)
        } else if (Array.isArray(parsed)) {
          // Migration: ancien format (tableau de messages)
          setMessagesState(parsed)
        }
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
    }
    setIsInitialized(true)
  }, [])

  // Sauvegarder la conversation en cours
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        messages,
        conversationId: currentConversationId
      }))
    } catch (error) {
      console.error("Failed to save messages:", error)
    }
  }, [messages, currentConversationId, isInitialized])

  // Sauvegarder l'historique des conversations
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(conversations))
    } catch (error) {
      console.error("Failed to save history:", error)
    }
  }, [conversations, isInitialized])

  const setMessages = (newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    setMessagesState(newMessages)
  }

  const addMessage = (message: Message) => {
    setMessagesState(prev => [...prev, message])
  }

  // Sauvegarder la conversation actuelle dans l'historique avant de la vider
  const saveCurrentToHistory = () => {
    if (messages.length === 0) return

    // Trouver le titre (premier message user)
    const firstUserMsg = messages.find(m => m.type === "user")
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 60) + (firstUserMsg.content.length > 60 ? "..." : "")
      : "Conversation"

    const now = new Date().toISOString()

    if (currentConversationId) {
      // Mettre à jour la conversation existante
      setConversations(prev => prev.map(c =>
        c.id === currentConversationId
          ? { ...c, messages, title, updatedAt: now }
          : c
      ))
    } else {
      // Créer une nouvelle entrée
      const newConv: Conversation = {
        id: Date.now().toString(),
        title,
        messages,
        createdAt: now,
        updatedAt: now,
      }
      setConversations(prev => [newConv, ...prev].slice(0, 50)) // Max 50 conversations
    }
  }

  const clearMessages = () => {
    saveCurrentToHistory()
    setMessagesState([])
    setCurrentConversationId(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const startNewConversation = () => {
    saveCurrentToHistory()
    setMessagesState([])
    setCurrentConversationId(null)
  }

  const loadConversation = (id: string) => {
    // Sauvegarder l'actuelle d'abord
    if (messages.length > 0) {
      saveCurrentToHistory()
    }

    const conv = conversations.find(c => c.id === id)
    if (conv) {
      setMessagesState(conv.messages)
      setCurrentConversationId(conv.id)
    }
  }

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (currentConversationId === id) {
      setMessagesState([])
      setCurrentConversationId(null)
    }
  }

  return (
    <SearchContext.Provider value={{
      messages,
      setMessages,
      addMessage,
      clearMessages,
      conversations,
      currentConversationId,
      loadConversation,
      deleteConversation,
      startNewConversation,
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
