// System Prompt Logos.rv
const SYSTEM_PROMPT = `Tu es l'Assistant de Recherche **Logos.rv**. Tu es un expert conçu pour aider les ministres et les croyants à préparer des études et leurs fiches bibliques précises.

**TON :**
- Sois respectueux, pastoral, clair et objectif.
- Ne donne jamais ton opinion personnelle, sois un relais fidèle de l'information.

**RÈGLE ABSOLUE — COMPORTEMENT :**
Tu es un système basé sur des données (RAG). Tu as l'interdiction absolue d'halluciner ou d'inventer des citations. Tu dois répondre **UNIQUEMENT** en te basant sur les extraits de texte qui te sont fournis en contexte. Si la réponse à la question de l'utilisateur ne se trouve pas dans le contexte, tu dois répondre poliment : *"Je n'ai pas trouvé d'informations exactes à ce sujet dans les documents actuels."*

**SOURCES :**
Ta base de vérité repose sur :
- Les **Saintes Écritures** (versions Louis Segond, Darby & Martin)
- Le corpus des **prédications de William Marrion Branham**

Tu dois toujours faire une **distinction claire** entre ce qui est biblique et ce qui vient d'un sermon.

**FORMAT DES RÉPONSES :**
- Sois concis et va droit au but.
- Utilise le **Markdown** (puces, gras) pour rendre la lecture facile.
- **Obligation stricte** : Chaque citation ou idée majeure doit être sourcée à la fin de la phrase.
  - Pour la Bible : **[Livre Chapitre:Verset]**
  - Pour les sermons : **[Titre du Sermon, Date, Paragraphe]**`

export async function generateGroqAnswer(
  query: string,
  context: Array<{
    title: string
    source: string
    content: string
    chunkIndex?: number
  }>
): Promise<string> {
  try {
    // Build context from search results
    const contextText = context
      .map((result, index) => {
        const isBranham = result.source === "BRANHAM"
        const paragraphNum = result.chunkIndex

        let citation = `[${index + 1}] Source: ${result.source}\nTitre: ${result.title}`
        if (isBranham && paragraphNum) {
          citation += `\nParagraphe: ${paragraphNum}`
        }
        citation += `\nContenu: ${result.content}\n`

        return citation
      })
      .join("\n")

    const userPrompt = `Contexte disponible:\n${contextText}\n\nQuestion de l'utilisateur: ${query}`

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined")
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 2048,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Groq API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error generating answer with Groq:", error)
    throw new Error("Failed to generate answer")
  }
}

export async function generateGroqAnswerStream(
  query: string,
  context: Array<{
    title: string
    source: string
    content: string
    chunkIndex?: number
  }>
): Promise<ReadableStream> {
  // Build context from search results
  const contextText = context
    .map((result, index) => {
      const isBranham = result.source === "BRANHAM"
      const paragraphNum = result.chunkIndex

      let citation = `[${index + 1}] Source: ${result.source}\nTitre: ${result.title}`
      if (isBranham && paragraphNum) {
        citation += `\nParagraphe: ${paragraphNum}`
      }
      citation += `\nContenu: ${result.content}\n`

      return citation
    })
    .join("\n")

  const userPrompt = `Contexte disponible:\n${contextText}\n\nQuestion de l'utilisateur: ${query}`

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined")
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 2048,
      temperature: 0.3,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Groq API error: ${error.error?.message || response.statusText}`)
  }

  return response.body!
}
