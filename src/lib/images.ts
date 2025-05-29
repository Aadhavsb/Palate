import axios from 'axios'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

export async function searchRecipeImage(recipeName: string, cuisineType: string): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured, using placeholder image')
    return `https://via.placeholder.com/800x600/1f2937/f97316?text=${encodeURIComponent(recipeName)}`
  }

  try {
    // Create search query combining recipe name and cuisine
    const query = `${recipeName} ${cuisineType} food dish`
    
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query,
        per_page: 5,
        orientation: 'landscape',
        content_filter: 'high',
      },
    })

    const photos = response.data.results
    
    if (photos && photos.length > 0) {
      // Return the regular size image URL
      return photos[0].urls.regular
    } else {
      // Fallback to a more generic food search
      const fallbackResponse = await axios.get('https://api.unsplash.com/search/photos', {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        params: {
          query: `${cuisineType} food`,
          per_page: 5,
          orientation: 'landscape',
          content_filter: 'high',
        },
      })
      
      const fallbackPhotos = fallbackResponse.data.results
      if (fallbackPhotos && fallbackPhotos.length > 0) {
        return fallbackPhotos[0].urls.regular
      }
    }
    
    // Final fallback to placeholder
    return `https://via.placeholder.com/800x600/1f2937/f97316?text=${encodeURIComponent(recipeName)}`
    
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error)
    return `https://via.placeholder.com/800x600/1f2937/f97316?text=${encodeURIComponent(recipeName)}`
  }
}
