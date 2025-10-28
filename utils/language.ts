/**
 * Detects if text contains Hebrew characters
 */
export function isHebrew(text: string): boolean {
  // Hebrew Unicode range: \u0590-\u05FF
  const hebrewRegex = /[\u0590-\u05FF]/
  return hebrewRegex.test(text)
}

/**
 * Detects the primary language of text
 */
export function detectLanguage(text: string): 'en' | 'he' {
  return isHebrew(text) ? 'he' : 'en'
}

/**
 * Generates YouTube karaoke search URL
 */
export function generateKaraokeUrl(songTitle: string, singerName: string, language: 'en' | 'he'): string {
  const karaokeWord = language === 'he' ? 'קריוקי' : 'karaoke'
  const searchQuery = `${singerName} ${songTitle} ${karaokeWord}`
  const encodedQuery = encodeURIComponent(searchQuery)
  
  return `https://www.youtube.com/results?search_query=${encodedQuery}`
}

/**
 * Returns the text direction based on language
 */
export function getTextDirection(language: 'en' | 'he'): 'ltr' | 'rtl' {
  return language === 'he' ? 'rtl' : 'ltr'
}

