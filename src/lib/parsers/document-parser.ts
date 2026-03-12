import mammoth from "mammoth"

export async function parseTextFile(buffer: Buffer): Promise<string> {
  return buffer.toString("utf-8")
}

export async function parseDocxFile(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error("Error parsing DOCX:", error)
    throw new Error("Failed to parse DOCX file")
  }
}

export async function parsePdfFile(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid TypeScript issues
    const pdfParse = await import("pdf-parse")
    const data = await (pdfParse as any).default(buffer)
    return data.text
  } catch (error) {
    console.error("Error parsing PDF:", error)
    throw new Error("Failed to parse PDF file")
  }
}

export async function parseDocument(
  buffer: Buffer,
  fileType: string
): Promise<string> {
  switch (fileType.toLowerCase()) {
    case "txt":
      return parseTextFile(buffer)
    case "docx":
      return parseDocxFile(buffer)
    case "pdf":
      return parsePdfFile(buffer)
    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}
