// Bible API integration
// Using API.Bible (free tier: 500 requests/day)

const BIBLE_API_KEY = process.env.BIBLE_API_KEY || ""
const API_BASE_URL = "https://api.scripture.api.bible/v1"

// Bible IDs for French versions
const BIBLE_IDS = {
  DARBY: "685d1470fe4d5c3b-01", // Darby French
  SEGOND: "bf8f1c7f3f9045e2-01", // Louis Segond 1910
  MARTIN: "c315fa9f71d4af3a-01", // Martin 1744
}

interface BibleBook {
  id: string
  name: string
  abbreviation: string
}

export async function fetchBibleBooks(bibleId: string): Promise<BibleBook[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/bibles/${bibleId}/books`, {
      headers: {
        "api-key": BIBLE_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching Bible books:", error)
    throw error
  }
}

export async function fetchChapterContent(
  bibleId: string,
  chapterId: string
): Promise<string> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=text`,
      {
        headers: {
          "api-key": BIBLE_API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data.content
  } catch (error) {
    console.error("Error fetching chapter:", error)
    throw error
  }
}

export async function fetchFullBible(
  bibleName: string,
  bibleId: string
): Promise<string> {
  console.log(`📖 Fetching ${bibleName}...`)

  try {
    const books = await fetchBibleBooks(bibleId)
    let fullText = `${bibleName}\n\n`

    for (const book of books) {
      console.log(`  📄 Fetching ${book.name}...`)

      // Get all chapters for this book
      const chaptersResponse = await fetch(
        `${API_BASE_URL}/bibles/${bibleId}/books/${book.id}/chapters`,
        {
          headers: {
            "api-key": BIBLE_API_KEY,
          },
        }
      )

      const chaptersData = await chaptersResponse.json()
      const chapters = chaptersData.data

      for (const chapter of chapters) {
        const content = await fetchChapterContent(bibleId, chapter.id)
        fullText += `\n\n${book.name} ${chapter.number}\n${content}`

        // Rate limiting: wait 100ms between requests
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    return fullText
  } catch (error) {
    console.error(`Error fetching ${bibleName}:`, error)
    throw error
  }
}

export { BIBLE_IDS }
