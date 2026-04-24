// ============================================
// USER & AUTH TYPES
// ============================================

export type Role = 'USER' | 'ADMIN'
export type Plan = 'FREE' | 'PREMIUM'

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  role: Role
  plan: Plan
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  stripeCurrentPeriodEnd?: Date
  createdAt: Date
  updatedAt: Date
}

// ============================================
// BIBLE TYPES
// ============================================

export type BibleVersion = 'darby' | 'segond' | 'martin'

export interface Verse {
  reference: string // Ex: "Jean 3:16"
  version: BibleVersion
  text: string
  book?: string
  chapter?: number
  verse?: number
}

// ============================================
// SHEET (Fiche de Prédication) TYPES
// ============================================

export interface OutlinePoint {
  id: string
  order: number
  title: string
  content: string
  verses: Verse[]
}

export interface Sheet {
  id: string
  userId: string
  title: string
  theme?: string
  mainVerses: Verse[]
  outline: OutlinePoint[]
  notes?: string
  searchResults?: SearchResult[]
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateSheetInput {
  title: string
  theme?: string
  mainVerses?: Verse[]
  outline?: OutlinePoint[]
  notes?: string
  tags?: string[]
}

export interface UpdateSheetInput extends Partial<CreateSheetInput> {
  id: string
}

// ============================================
// SEARCH TYPES
// ============================================

export type SearchMode = 'SEARCH' | 'QA'
export type Source = 'BIBLE_DARBY' | 'BIBLE_SEGOND' | 'BIBLE_MARTIN' | 'BRANHAM'
// Note: 'PASTOR' source removed for MVP - will be added in future version

export interface SearchFilters {
  sources?: Source[]
  dateRange?: {
    from?: Date
    to?: Date
  }
}

export interface SearchResult {
  id: string
  source: Source
  title: string
  reference: string // Ex: "Jean 3:16" ou "La Semence du Serpent - 1958"
  content: string
  score: number // Score de pertinence (0-1)
  metadata?: Record<string, any>
}

export interface SearchRequest {
  query: string
  mode: SearchMode
  filters?: SearchFilters
  topK?: number // Nombre de résultats (default: 10)
}

export interface SearchResponse {
  results: SearchResult[]
  answer?: string // Pour mode Q&A
  latencyMs: number
  cached: boolean
}

export interface Search {
  id: string
  userId: string
  query: string
  mode: SearchMode
  filters?: SearchFilters
  results: SearchResult[]
  latencyMs?: number
  createdAt: Date
}

// ============================================
// DOCUMENT TYPES
// ============================================

export interface Document {
  id: string
  title: string
  source: Source
  content: string
  metadata?: Record<string, any>
  vectorId?: string
  indexed: boolean
  filePath?: string
  fileType?: string
  fileSize?: number
  createdAt: Date
  updatedAt: Date
}

export interface UploadDocumentInput {
  file: File
  source: Source
  title: string
  metadata?: Record<string, any>
}

export interface DocumentChunk {
  content: string
  metadata: {
    documentId: string
    source: Source
    title: string
    chunkIndex: number
    totalChunks: number
  }
}

// ============================================
// RATE LIMITING TYPES
// ============================================

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number // Timestamp
}

export interface PlanLimits {
  searchesPerDay: number
  maxSheets: number
  features: {
    fullBranhamAccess: boolean
    pastorAccess: boolean
    pdfExport: boolean
    prioritySupport: boolean
  }
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    searchesPerDay: 10,
    maxSheets: 5,
    features: {
      fullBranhamAccess: false,
      pastorAccess: false, // Disabled for MVP
      pdfExport: false,
      prioritySupport: false
    }
  },
  PREMIUM: {
    searchesPerDay: 1000, // Soft limit
    maxSheets: -1, // Illimité
    features: {
      fullBranhamAccess: true,
      pastorAccess: false, // Disabled for MVP - will be added later
      pdfExport: true,
      prioritySupport: true
    }
  }
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// ============================================
// STRIPE TYPES
// ============================================

export interface SubscriptionStatus {
  isActive: boolean
  plan: Plan
  currentPeriodEnd?: Date
  cancelAtPeriodEnd?: boolean
}

export interface CheckoutSessionInput {
  priceId: string
  successUrl: string
  cancelUrl: string
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsEvent {
  event: string
  userId?: string
  properties?: Record<string, any>
  timestamp: Date
}

export interface UserStats {
  totalSearches: number
  totalSheets: number
  searchesThisMonth: number
  sheetsThisMonth: number
  lastSearchAt?: Date
  lastSheetCreatedAt?: Date
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  name?: string
}

export interface ResetPasswordFormData {
  email: string
}

export interface SearchFormData {
  query: string
  mode: SearchMode
  sources?: Source[]
}

export interface SheetFormData {
  title: string
  theme?: string
  notes?: string
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ============================================
// ERROR TYPES
// ============================================

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const ErrorCodes = {
  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PLAN_LIMIT_EXCEEDED: 'PLAN_LIMIT_EXCEEDED',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // External Services
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  STRIPE_ERROR: 'STRIPE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',

  // Generic
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]
