# Architecture IA & RAG - Logos.rv

## Vue d'ensemble

Logos.rv utilise une architecture RAG (Retrieval Augmented Generation) pour fournir des réponses bibliques précises et contextualisées.

## 1. Pipeline de Recherche

### 1.1 Flow Général

```
User Query → Embedding → Vector Search → Context Retrieval → LLM → Response
```

### 1.2 Détails Techniques

#### Étape 1: Génération d'Embedding

```typescript
// lib/ai/embeddings.ts
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
    dimensions: 1536, // Optimisé pour performance/coût
  })

  return response.data[0].embedding
}
```

#### Étape 2: Recherche Vectorielle

```typescript
// lib/ai/search.ts
import { Index } from "@upstash/vector"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_URL!,
  token: process.env.UPSTASH_VECTOR_TOKEN!,
})

export async function vectorSearch(
  query: string,
  filters?: { source?: string[] },
  topK: number = 10
) {
  const embedding = await generateEmbedding(query)

  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
    filter: filters?.source ? `source IN [${filters.source.join(",")}]` : undefined,
  })

  return results
}
```

#### Étape 3: Génération de Réponse (Mode Q&A)

```typescript
// lib/ai/qa.ts
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateAnswer(question: string, context: SearchResult[]) {
  const contextText = context
    .map((r) => `[${r.source}] ${r.reference}\n${r.content}`)
    .join("\n\n---\n\n")

  const systemPrompt = `Tu es un assistant biblique spécialisé pour les pasteurs et prédicateurs.
Tu as accès aux sources suivantes :
- Bible Darby, Segond, Martin
- Prédications de William Marrion Branham
- Prédications du pasteur local

Réponds aux questions en te basant UNIQUEMENT sur le contexte fourni.
Cite toujours tes sources avec les références exactes.
Si tu ne trouves pas la réponse dans le contexte, dis-le clairement.`

  const userPrompt = `Contexte:\n${contextText}\n\nQuestion: ${question}\n\nRéponds en français de manière claire et structurée.`

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3, // Réponses plus factuelles
    max_tokens: 1000,
  })

  return response.choices[0].message.content
}
```

## 2. Indexation des Documents

### 2.1 Pipeline d'Indexation

```
Upload File → Parse → Chunk → Generate Embeddings → Store in Vector DB → Update DB
```

### 2.2 Parsing des Fichiers

```typescript
// lib/ai/parsers.ts
import mammoth from "mammoth"
import { readFile } from "fs/promises"

export async function parseDocument(
  filePath: string,
  fileType: "txt" | "docx" | "pptx"
): Promise<string> {
  switch (fileType) {
    case "txt":
      return await readFile(filePath, "utf-8")

    case "docx":
      const result = await mammoth.extractRawText({ path: filePath })
      return result.value

    case "pptx":
      // Utiliser une lib comme pptx-parser ou officegen
      // Pour MVP, demander conversion en txt/docx
      throw new Error("PPTX parsing not implemented yet")

    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}
```

### 2.3 Chunking Intelligent

```typescript
// lib/ai/chunking.ts
export interface Chunk {
  content: string
  metadata: {
    source: string
    title: string
    chunkIndex: number
    totalChunks: number
  }
}

export function chunkDocument(
  content: string,
  metadata: { source: string; title: string },
  chunkSize: number = 800, // tokens approximatifs
  overlap: number = 100
): Chunk[] {
  // Découpe par paragraphes d'abord
  const paragraphs = content.split(/\n\n+/)
  const chunks: Chunk[] = []
  let currentChunk = ""
  let chunkIndex = 0

  for (const paragraph of paragraphs) {
    const potentialChunk = currentChunk + "\n\n" + paragraph

    // Estimation tokens (1 token ≈ 4 chars)
    if (potentialChunk.length / 4 > chunkSize && currentChunk) {
      chunks.push({
        content: currentChunk.trim(),
        metadata: {
          ...metadata,
          chunkIndex,
          totalChunks: 0, // Sera mis à jour après
        },
      })

      // Overlap: garder les derniers mots
      const words = currentChunk.split(" ")
      const overlapWords = words.slice(-overlap)
      currentChunk = overlapWords.join(" ") + "\n\n" + paragraph
      chunkIndex++
    } else {
      currentChunk = potentialChunk
    }
  }

  // Dernier chunk
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        ...metadata,
        chunkIndex,
        totalChunks: 0,
      },
    })
  }

  // Mettre à jour totalChunks
  const totalChunks = chunks.length
  chunks.forEach((chunk) => {
    chunk.metadata.totalChunks = totalChunks
  })

  return chunks
}
```

### 2.4 Job Inngest pour Indexation

```typescript
// inngest/functions/index-document.ts
import { inngest } from "../client"
import { parseDocument } from "@/lib/ai/parsers"
import { chunkDocument } from "@/lib/ai/chunking"
import { generateEmbedding } from "@/lib/ai/embeddings"
import { Index } from "@upstash/vector"
import { prisma } from "@/lib/prisma"

export const indexDocument = inngest.createFunction(
  { id: "index-document" },
  { event: "document/uploaded" },
  async ({ event, step }) => {
    const { documentId, filePath, fileType, source, title } = event.data

    // Étape 1: Parse le fichier
    const content = await step.run("parse-file", async () => {
      return await parseDocument(filePath, fileType)
    })

    // Étape 2: Découpe en chunks
    const chunks = await step.run("chunk-document", async () => {
      return chunkDocument(content, { source, title })
    })

    // Étape 3: Génère embeddings et indexe
    await step.run("generate-embeddings", async () => {
      const index = new Index({
        url: process.env.UPSTASH_VECTOR_URL!,
        token: process.env.UPSTASH_VECTOR_TOKEN!,
      })

      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.content)

        await index.upsert({
          id: `${documentId}-chunk-${chunk.metadata.chunkIndex}`,
          vector: embedding,
          metadata: {
            documentId,
            content: chunk.content,
            source: chunk.metadata.source,
            title: chunk.metadata.title,
            chunkIndex: chunk.metadata.chunkIndex,
          },
        })
      }
    })

    // Étape 4: Marque comme indexé dans DB
    await step.run("update-database", async () => {
      await prisma.document.update({
        where: { id: documentId },
        data: { indexed: true },
      })
    })

    return { success: true, chunksIndexed: chunks.length }
  }
)
```

## 3. Optimisations

### 3.1 Cache Redis

```typescript
// lib/ai/cache.ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export async function getCachedSearch(query: string) {
  const cacheKey = `search:${query.toLowerCase().trim()}`
  return await redis.get(cacheKey)
}

export async function setCachedSearch(
  query: string,
  results: any,
  ttl: number = 3600 // 1 heure
) {
  const cacheKey = `search:${query.toLowerCase().trim()}`
  await redis.setex(cacheKey, ttl, JSON.stringify(results))
}
```

### 3.2 Rate Limiting

```typescript
// lib/rate-limit.ts
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

// Plan gratuit: 10 recherches/jour
export const freePlanLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "24 h"),
  analytics: true,
})

// Plan premium: 1000 recherches/jour (soft limit)
export const premiumPlanLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "24 h"),
  analytics: true,
})

export async function checkRateLimit(userId: string, plan: "FREE" | "PREMIUM") {
  const limiter = plan === "FREE" ? freePlanLimit : premiumPlanLimit
  const identifier = `user:${userId}`

  const { success, limit, remaining, reset } = await limiter.limit(identifier)

  return { success, limit, remaining, reset }
}
```

## 4. Indexation des Bibles

### 4.1 Structure des Données Bibliques

```typescript
// scripts/index-bibles.ts
interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  version: "darby" | "segond" | "martin"
}

// Format attendu: JSON ou CSV
// Exemple: bibles/darby.json
;[
  {
    book: "Genèse",
    chapter: 1,
    verse: 1,
    text: "Au commencement Dieu créa les cieux et la terre.",
  },
  // ...
]
```

### 4.2 Script d'Indexation

```typescript
// scripts/index-bibles.ts
import { readFile } from "fs/promises"
import { generateEmbedding } from "@/lib/ai/embeddings"
import { Index } from "@upstash/vector"
import { prisma } from "@/lib/prisma"

async function indexBible(version: "darby" | "segond" | "martin") {
  const filePath = `./data/bibles/${version}.json`
  const verses: BibleVerse[] = JSON.parse(await readFile(filePath, "utf-8"))

  const index = new Index({
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.UPSTASH_VECTOR_TOKEN!,
  })

  // Grouper par passages (3-5 versets) pour meilleur contexte
  const passages: BibleVerse[][] = []
  let currentPassage: BibleVerse[] = []

  for (const verse of verses) {
    currentPassage.push(verse)

    if (currentPassage.length === 5) {
      passages.push([...currentPassage])
      currentPassage = [currentPassage[currentPassage.length - 1]] // Overlap
    }
  }

  // Indexer chaque passage
  for (const passage of passages) {
    const text = passage.map((v) => v.text).join(" ")
    const reference = `${passage[0].book} ${passage[0].chapter}:${passage[0].verse}-${passage[passage.length - 1].verse}`

    const embedding = await generateEmbedding(text)

    await index.upsert({
      id: `bible-${version}-${reference.replace(/\s/g, "-")}`,
      vector: embedding,
      metadata: {
        source: `BIBLE_${version.toUpperCase()}`,
        reference,
        content: text,
        book: passage[0].book,
        chapter: passage[0].chapter,
        verses: passage.map((v) => v.verse),
      },
    })

    // Créer entrée dans DB
    await prisma.document.create({
      data: {
        title: reference,
        source: `BIBLE_${version.toUpperCase()}` as any,
        content: text,
        metadata: { reference, book: passage[0].book, chapter: passage[0].chapter },
        indexed: true,
      },
    })
  }

  console.log(`✅ Bible ${version} indexée: ${passages.length} passages`)
}

// Exécuter
async function main() {
  await indexBible("darby")
  await indexBible("segond")
  await indexBible("martin")
}

main()
```

## 5. Coûts Estimés

### 5.1 OpenAI API

**Embeddings (text-embedding-3-large):**

- Prix: $0.13 / 1M tokens
- Estimation: 1 recherche = ~100 tokens = $0.000013
- 10,000 recherches/mois = $0.13

**GPT-4 Turbo (Q&A):**

- Prix: $10 / 1M input tokens, $30 / 1M output tokens
- Estimation: 1 Q&A = 2000 input + 500 output = $0.035
- 1,000 Q&A/mois = $35

**Total estimé:** ~$40-50/mois pour 1000 utilisateurs actifs

### 5.2 Optimisations Coûts

1. **Cache agressif** (Redis): Réduire appels API répétés
2. **Limites plan gratuit**: 10 recherches/jour max
3. **Batch embeddings**: Grouper requêtes si possible
4. **Modèle plus petit pour recherche simple**: text-embedding-3-small ($0.02/1M tokens)

## 6. Métriques à Tracker

```typescript
// lib/analytics.ts
import { PostHog } from "posthog-node"

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})

export function trackSearch(
  userId: string,
  query: string,
  mode: "SEARCH" | "QA",
  resultsCount: number
) {
  posthog.capture({
    distinctId: userId,
    event: "search_performed",
    properties: {
      query_length: query.length,
      mode,
      results_count: resultsCount,
    },
  })
}

export function trackSearchLatency(userId: string, latencyMs: number) {
  posthog.capture({
    distinctId: userId,
    event: "search_latency",
    properties: { latency_ms: latencyMs },
  })
}
```

## 7. Prochaines Étapes

1. Setup Upstash Vector + Redis
2. Implémenter pipeline d'indexation
3. Indexer les 3 Bibles
4. Tester recherche vectorielle
5. Implémenter Q&A avec GPT-4
6. Optimiser prompts système
7. Ajouter cache + rate limiting
8. Monitorer coûts API
