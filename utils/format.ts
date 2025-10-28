import { isHebrew } from './language'

/**
 * Converts text to title case (capitalizes first letter of each word)
 * Only applies to English text
 */
export function toTitleCase(text: string): string {
  if (!text) return text
  
  // Don't modify Hebrew text
  if (isHebrew(text)) return text
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Formats singer name - applies title case for English
 */
export function formatSingerName(name: string): string {
  return toTitleCase(name.trim())
}

/**
 * Formats song title - applies title case for English
 */
export function formatSongTitle(title: string): string {
  return toTitleCase(title.trim())
}

