import { isHebrew } from './language'

/**
 * Fetches singer image from Wikipedia API
 * Automatically detects language and uses appropriate Wikipedia (en/he)
 * @param singerName - The name of the singer to search for
 * @returns Image URL or null if not found
 */
export async function fetchSingerImageFromWikipedia(
  singerName: string
): Promise<string | null> {
  try {
    // Sanitize and validate singer name
    const sanitizedName = singerName.trim()
    if (!sanitizedName || sanitizedName.length < 2) {
      return null
    }

    // Detect language and choose appropriate Wikipedia
    const useHebrewWikipedia = isHebrew(sanitizedName)
    const wikipediaLang = useHebrewWikipedia ? 'he' : 'en'
    
    // Encode the singer name for URL
    const encodedName = encodeURIComponent(sanitizedName)
    
    // Wikipedia API endpoint (Hebrew or English)
    const apiUrl = `https://${wikipediaLang}.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=500&origin=*`

    console.log(`Fetching image for "${sanitizedName}" from ${wikipediaLang.toUpperCase()} Wikipedia`)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Wikipedia API request failed:', response.status)
      return null
    }

    const data = await response.json()

    // Extract image URL from response
    const pages = data?.query?.pages
    if (!pages) {
      return null
    }

    // Get the first (and usually only) page
    const pageId = Object.keys(pages)[0]
    const page = pages[pageId]

    // Check if page exists (pageId -1 means page not found)
    if (pageId === '-1') {
      console.log(`No Wikipedia page found for "${sanitizedName}"`)
      return null
    }

    // Check if we have a valid image
    if (page?.thumbnail?.source) {
      console.log(`Found image for "${sanitizedName}": ${page.thumbnail.source}`)
      return page.thumbnail.source
    }

    // Try original image if thumbnail not available
    if (page?.original?.source) {
      console.log(`Found original image for "${sanitizedName}": ${page.original.source}`)
      return page.original.source
    }

    console.log(`Wikipedia page found for "${sanitizedName}" but no image available`)
    return null
  } catch (error) {
    console.error('Error fetching image from Wikipedia:', error)
    return null
  }
}

/**
 * Fetches singer image with caching check
 * Checks if image already exists in cache before fetching
 */
export async function fetchSingerImageWithCache(
  singerName: string,
  existingImageUrl: string | null | undefined
): Promise<string | null> {
  // If we already have an image URL, return it
  if (existingImageUrl) {
    return existingImageUrl
  }

  // Otherwise, fetch from Wikipedia
  return await fetchSingerImageFromWikipedia(singerName)
}

