// API service for making requests to the backend

// Use a function to get the API URL to avoid issues during SSR
const getApiUrl = () =>  'https://trendgenie-with-ai.onrender.com';

/**
 * Fetch data from the API
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The response data
 */
export const fetchFromAPI = async (endpoint, options = {}) => {
  try {
    const url = `${getApiUrl()}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};


export const generateVideoContent = async (topic, niche ) => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`https://trendgenie-with-ai.onrender.com/api/generate-video-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, niche }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    // Validate the response structure
    if (!data.content) {
      throw new Error('Invalid response format from the server');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};