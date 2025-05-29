import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.warn('UNSPLASH_ACCESS_KEY not found. Image search will use placeholder images.');
}

export const searchRecipeImage = async (recipeName: string, cuisineType: string = ''): Promise<string> => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured, using placeholder image');
    return generatePlaceholderImage(recipeName);
  }

  try {
    // Primary search with recipe name
    const primaryQuery = recipeName.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    const primaryResponse = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query: `${primaryQuery} food dish`,
        per_page: 5,
        orientation: 'landscape',
        content_filter: 'high',
      },
      timeout: 10000,
    });

    const primaryPhotos = primaryResponse.data.results;
    if (primaryPhotos && primaryPhotos.length > 0) {
      return primaryPhotos[0].urls.regular;
    }

    // Fallback search with cuisine type
    if (cuisineType) {
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
        timeout: 10000,
      });
      
      const fallbackPhotos = fallbackResponse.data.results;
      if (fallbackPhotos && fallbackPhotos.length > 0) {
        return fallbackPhotos[0].urls.regular;
      }
    }

    // Generic food fallback
    const genericResponse = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query: 'delicious food',
        per_page: 10,
        orientation: 'landscape',
        content_filter: 'high',
      },
      timeout: 10000,
    });

    const genericPhotos = genericResponse.data.results;
    if (genericPhotos && genericPhotos.length > 0) {
      const randomIndex = Math.floor(Math.random() * genericPhotos.length);
      return genericPhotos[randomIndex].urls.regular;
    }

    // Final fallback to placeholder
    return generatePlaceholderImage(recipeName);
    
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return generatePlaceholderImage(recipeName);
  }
};

export const getGenericFoodImage = async (): Promise<string> => {
  if (!UNSPLASH_ACCESS_KEY) {
    return generatePlaceholderImage('Delicious Food');
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query: 'food cooking kitchen',
        per_page: 10,
        orientation: 'landscape',
        content_filter: 'high',
      },
      timeout: 10000,
    });

    const photos = response.data.results;
    if (photos && photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * photos.length);
      return photos[randomIndex].urls.regular;
    }

    throw new Error('No generic images found');
  } catch (error) {
    console.error('Error fetching generic food image:', error);
    return generatePlaceholderImage('Delicious Food');
  }
};

const generatePlaceholderImage = (recipeName: string): string => {
  const encodedName = encodeURIComponent(recipeName);
  return `https://via.placeholder.com/800x600/1f2937/f97316?text=${encodedName}`;
};

export const downloadAndOptimizeImage = async (imageUrl: string): Promise<Buffer> => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Palate-Recipe-App/1.0'
      },
      maxRedirects: 5,
    });
    
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
};

export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.head(url, { timeout: 5000 });
    return response.status === 200 && response.headers['content-type']?.startsWith('image/');
  } catch {
    return false;
  }
};
