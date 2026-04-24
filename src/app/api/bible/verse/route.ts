import fs from "fs"
import path from "path"

export interface BibleVerse {
  reference: string
  text: string
  version: string
}

// Map user-facing version names to Bible files
const VERSION_TO_FILE: Record<string, string> = {
  "Louis Segond": "segond.txt",
  "Darby": "darby.txt",
  "Martin": "martin.txt",
}

// Map French book names to abbreviations (Louis Segond format: "GEN 1:1\t...")
const FRENCH_TO_ABBR: Record<string, string> = {
  "Genèse": "GEN", "Exode": "EXO", "Lévitique": "LEV", "Nombres": "NUM",
  "Deutéronome": "DEU", "Josué": "JOS", "Juges": "JDG", "Ruth": "RUT",
  "1 Samuel": "1SA", "2 Samuel": "2SA", "1 Rois": "1KI", "2 Rois": "2KI",
  "1 Chroniques": "1CH", "2 Chroniques": "2CH", "Esdras": "EZR",
  "Néhémie": "NEH", "Esther": "EST", "Job": "JOB", "Psaumes": "PSA",
  "Proverbes": "PRO", "Ecclésiaste": "ECC", "Cantique des Cantiques": "SNG",
  "Ésaïe": "ISA", "Jérémie": "JER", "Lamentations": "LAM", "Ézéchiel": "EZK",
  "Daniel": "DAN", "Osée": "HOS", "Joël": "JOL", "Amos": "AMO",
  "Abdias": "OBA", "Jonas": "JON", "Michée": "MIC", "Nahum": "NAH",
  "Habacuc": "HAB", "Sophonie": "ZEP", "Aggée": "HAG", "Zacharie": "ZEC",
  "Malachie": "MAL", "Matthieu": "MAT", "Marc": "MRK", "Luc": "LUK",
  "Jean": "JHN", "Actes": "ACT", "Romains": "ROM", "1 Corinthiens": "1CO",
  "2 Corinthiens": "2CO", "Galates": "GAL", "Éphésiens": "EPH",
  "Philippiens": "PHP", "Colossiens": "COL", "1 Thessaloniciens": "1TH",
  "2 Thessaloniciens": "2TH", "1 Timothée": "1TI", "2 Timothée": "2TI",
  "Tite": "TIT", "Philémon": "PHM", "Hébreux": "HEB", "Jacques": "JAS",
  "1 Pierre": "1PE", "2 Pierre": "2PE", "1 Jean": "1JN", "2 Jean": "2JN",
  "3 Jean": "3JN", "Jude": "JUD", "Apocalypse": "REV",
}

// Map French book names to English (Darby/Martin format: "### John\n[3:16] ...")
const FRENCH_TO_ENGLISH: Record<string, string> = {
  "Genèse": "Genesis", "Exode": "Exodus", "Lévitique": "Leviticus",
  "Nombres": "Numbers", "Deutéronome": "Deuteronomy", "Josué": "Joshua",
  "Juges": "Judges", "Ruth": "Ruth", "1 Samuel": "I Samuel", "2 Samuel": "II Samuel",
  "1 Rois": "I Kings", "2 Rois": "II Kings", "1 Chroniques": "I Chronicles",
  "2 Chroniques": "II Chronicles", "Esdras": "Ezra", "Néhémie": "Nehemiah",
  "Esther": "Esther", "Job": "Job", "Psaumes": "Psalms", "Proverbes": "Proverbs",
  "Ecclésiaste": "Ecclesiastes", "Cantique des Cantiques": "Song of Solomon",
  "Ésaïe": "Isaiah", "Jérémie": "Jeremiah", "Lamentations": "Lamentations",
  "Ézéchiel": "Ezekiel", "Daniel": "Daniel", "Osée": "Hosea", "Joël": "Joel",
  "Amos": "Amos", "Abdias": "Obadiah", "Jonas": "Jonah", "Michée": "Micah",
  "Nahum": "Nahum", "Habacuc": "Habakkuk", "Sophonie": "Zephaniah",
  "Aggée": "Haggai", "Zacharie": "Zechariah", "Malachie": "Malachi",
  "Matthieu": "Matthew", "Marc": "Mark", "Luc": "Luke", "Jean": "John",
  "Actes": "Acts", "Romains": "Romans", "1 Corinthiens": "I Corinthians",
  "2 Corinthiens": "II Corinthians", "Galates": "Galatians", "Éphésiens": "Ephesians",
  "Philippiens": "Philippians", "Colossiens": "Colossians",
  "1 Thessaloniciens": "I Thessalonians", "2 Thessaloniciens": "II Thessalonians",
  "1 Timothée": "I Timothy", "2 Timothée": "II Timothy", "Tite": "Titus",
  "Philémon": "Philemon", "Hébreux": "Hebrews", "Jacques": "James",
  "1 Pierre": "I Peter", "2 Pierre": "II Peter", "1 Jean": "I John",
  "2 Jean": "II John", "3 Jean": "III John", "Jude": "Jude",
  "Apocalypse": "Revelation of John",
}

/**
 * Read a verse directly from the Bible text file.
 * This is more reliable than vector search since it covers every verse.
 */
function readVerseFromFile(
  filePath: string,
  bookFr: string,
  chapter: string,
  verse: string,
  isSegond: boolean
): string | null {
  if (!fs.existsSync(filePath)) return null

  const content = fs.readFileSync(filePath, "utf-8")

  if (isSegond) {
    // Louis Segond format: "ABR chapter:verse\ttext\n"
    const abbr = FRENCH_TO_ABBR[bookFr]
    if (!abbr) return null

    const pattern = new RegExp(`^${abbr}\\s+${chapter}:${verse}\\t(.+)$`, "m")
    const match = content.match(pattern)
    return match?.[1]?.trim() || null

  } else {
    // Darby/Martin format: "### BookName\n...\n[chapter:verse] text\n"
    const englishBook = FRENCH_TO_ENGLISH[bookFr]
    if (!englishBook) return null

    // Find the book section
    const bookSectionPattern = new RegExp(
      `### ${englishBook}\\s*\\n([\\s\\S]*?)(?=### |$)`,
      "i"
    )
    const bookSection = content.match(bookSectionPattern)
    if (!bookSection?.[1]) return null

    // Find the verse within the book section
    const versePattern = new RegExp(
      `\\[${chapter}:${verse}\\]\\s*(.+?)(?=\\[\\d+:\\d+\\]|$)`,
      "s"
    )
    const verseMatch = bookSection[1].match(versePattern)
    if (verseMatch?.[1]) {
      return verseMatch[1].trim().replace(/\r?\n/g, " ").replace(/\s+/g, " ")
    }

    return null
  }
}

export async function POST(req: Request) {
  try {
    const { book, chapter, verse, version } = await req.json()

    // Validate input
    if (!book || !chapter || !verse) {
      return new Response(
        JSON.stringify({ error: "Livre, chapitre et verset sont requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const reference = `${book} ${chapter}:${verse}`
    const fileName = VERSION_TO_FILE[version] || "segond.txt"
    const isSegond = fileName === "segond.txt"
    const filePath = path.join(process.cwd(), "data", "bibles", fileName)

    // Read verse directly from the Bible file
    const verseText = readVerseFromFile(filePath, book, chapter, verse, isSegond)

    if (!verseText) {
      return new Response(
        JSON.stringify({
          error: `Verset ${reference} non trouvé dans ${version}`,
          reference,
          suggestion: "Vérifiez le livre, le chapitre et le numéro de verset"
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    const bibleVerse: BibleVerse = {
      reference,
      text: verseText,
      version: version || "Bible",
    }

    return new Response(
      JSON.stringify(bibleVerse),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )

  } catch (error: any) {
    console.error("Bible verse fetch error:", error)
    return new Response(
      JSON.stringify({
        error: "Erreur lors de la récupération du verset",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
