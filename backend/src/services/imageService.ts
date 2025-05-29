import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export const searchRecipeImage = async (recipeName: string, cuisineType: string): Promise<string> => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured, using placeholder image');
    return generatePlaceholderImage(recipeName);
  }

  try {
    // Create search query combining recipe name and cuisine
    const query = `${recipeName} ${cuisineType} food dish delicious`;
    
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query,
        per_page: 10,
        orientation: 'landscape',
        content_filter: 'high',
        order_by: 'relevance'
      },
      timeout: 5000
    });

    const photos = response.data.results;
    
    if (photos && photos.length > 0) {
      // Return a random image from the first few results
      const randomIndex = Math.floor(Math.random() * Math.min(5, photos.length));
      return photos[randomIndex].urls.regular;
    } else {
      // Fallback to a more generic food search
      return await searchGenericFoodImage(cuisineType);
    }
    
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return generatePlaceholderImage(recipeName);
  }
};

const searchGenericFoodImage = async (cuisineType: string): Promise<string> => {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query: `${cuisineType} food delicious`,
        per_page: 5,
        orientation: 'landscape',
        content_filter: 'high',
      },
      timeout: 5000
    });
    
    const photos = response.data.results;
    if (photos && photos.length > 0) {
      return photos[0].urls.regular;
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
      timeout: 10000,
      headers: {
        'User-Agent': 'Palate-Recipe-App/1.0'
      }
    });
    
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
};
