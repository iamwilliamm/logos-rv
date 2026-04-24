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
    const { PDFParse } = require("pdf-parse")
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    await parser.destroy()
    return result.text
  } catch (error) {
    console.error("Error parsing PDF:", error)
    throw new Error("Failed to parse PDF file")
  }
}

export async function parsePptxFile(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for pptx parser
    // @ts-expect-error - No types available for pptx-parser
    const pptxParser = await import("pptx-parser")
    const text = await (pptxParser as any).default(buffer)
    return text
  } catch (error) {
    console.error("Error parsing PPTX:", error)
    throw new Error("Failed to parse PPTX file")
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
    case "doc":
      return parseDocxFile(buffer)
    case "pdf":
      return parsePdfFile(buffer)
    case "pptx":
    case "ppt":
      return parsePptxFile(buffer)
    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}
