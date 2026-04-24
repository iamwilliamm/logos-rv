export interface BranhamParagraph {
  sermonTitle: string
  sermonDate: string
  paragraphNumber: number
  content: string
}

export function parseBranhamDocument(text: string): BranhamParagraph[] {
  const paragraphs: BranhamParagraph[] = []
  
  // Split by sermon titles (all caps followed by English title and date)
  const sermonPattern = /\n\s*([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ\s]+)\n\s*([A-Za-z\s]+)\n\s*(\d{1,2}\s+[A-Za-zéû]+\s+\d{4})/g
  
  const sermons = text.split(sermonPattern)
  
  for (let i = 1; i < sermons.length; i += 4) {
    const frenchTitle = sermons[i]?.trim()
    // const englishTitle = sermons[i + 1]?.trim()
    const date = sermons[i + 2]?.trim()
    const content = sermons[i + 3]
    
    if (!content) continue
    
    const sermonTitle = `${frenchTitle} (${date})`
    
    // Extract numbered paragraphs
    const paragraphPattern = /\n\s*(\d+)\s+([^\n]+(?:\n(?!\s*\d+\s)[^\n]+)*)/g
    let match
    
    while ((match = paragraphPattern.exec(content)) !== null) {
      const paragraphNumber = parseInt(match[1])
      const paragraphContent = match[2].trim()
      
      if (paragraphContent.length > 50) { // Ignore very short paragraphs
        paragraphs.push({
          sermonTitle,
          sermonDate: date,
          paragraphNumber,
          content: paragraphContent
        })
      }
    }
  }
  
  return paragraphs
}
