import axios from 'axios';

// Create a base API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api',
});

// At the top of your API service file
// console.log('API Base URL being used:', process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api');

// Get all articles with pagination, sorting, and filtering
export const getArticles = async (page = 1, pageSize = 10, sort = 'publishDate:desc', filters = {}) => {
  try {
    // Build query parameters
    const queryParams = {
      sort,
      pagination: {
        page,
        pageSize,
      },
      populate: '*'
    };

    // Add filters if they exist
    if (Object.keys(filters).length) {
      queryParams.filters = filters;
    }

    // console.log('Query params for getArticles:', queryParams);

    const response = await api.get('/articles', {
      params: queryParams
    });

    // console.log('Strapi response:', response.data);
    
    // Return the data as is - since your Strapi doesn't use the attributes structure
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Error fetching articles:', error.response?.data || error.message || error);
    return { data: [], meta: { pagination: { page: 1, pageSize, total: 0 } } };
  }
};

// Get a single article by ID
export const getArticleById = async (id) => {
  try {
    const response = await api.get(`/articles/${id}`, {
      params: {
        populate: '*',
      },
    });

    // console.log('Article by ID response:', response.data);
    
    // Return the article data directly, not wrapped in response.data.data
    return response.data || null;
  } catch (error) {
    console.error('Error fetching article by ID:', error.response?.data || error.message || error);
    return null;
  }
};

// Get a single article by slug
export const getArticleBySlug = async (slug) => {
  try {
    // console.log('Fetching article by slug:', slug);
    
    const response = await api.get('/articles', {
      params: {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: '*',
      },
    });

    // console.log('Article by slug response:', response.data);
    
    // Return the first article directly (not inside attributes)
    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error fetching article by slug:', error.response?.data || error.message || error);
    return null;
  }
};

// Search articles
export const searchArticles = async (query, page = 1, pageSize = 10) => {
  try {
    const response = await api.get('/articles', {
      params: {
        populate: '*',
        pagination: {
          page,
          pageSize,
        },
        filters: {
          $or: [
            {
              title: {
                $containsi: query,
              },
            },
            {
              content: {
                $containsi: query,
              },
            },
            {
              excerpt: {
                $containsi: query,
              },
            },
          ],
        },
      },
    });

    // console.log('Search results:', response.data);

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Error searching articles:', error.response?.data || error.message || error);
    return { data: [], meta: { pagination: { page: 1, pageSize, total: 0 } } };
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await api.get('/categories', {
      params: {
        populate: '*',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message || error);
    return [];
  }
};

export const getAffiliateLinks = async (page = 1, pageSize = 12, sort = 'name:asc', filters = {}) => {
  try {
    // Build query parameters
    const queryParams = {
      sort,
      pagination: {
        page,
        pageSize,
      },
      populate: '*' // Make sure to populate all fields
    };

    // Add filters if they exist
    if (Object.keys(filters).length) {
      queryParams.filters = filters;
    }

    const response = await api.get('/affiliates', {
      params: queryParams
    });
    
    // Return the data structure matching the same pattern as other API functions
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Error fetching affiliate links:', error.response?.data || error.message || error);
    return { data: [], meta: { pagination: { page: 1, pageSize, total: 0 } } };
  }
};

// Get a single affiliate link by ID
export const getAffiliateLinkById = async (id) => {
  try {
    const response = await api.get(`/affiliates/${id}`, {
      params: {
        populate: '*',
      },
    });
    
    return response.data || null;
  } catch (error) {
    console.error('Error fetching affiliate link by ID:', error.response?.data || error.message || error);
    return null;
  }
};

// Get a single affiliate link by slug
export const getAffiliateLinkBySlug = async (slug) => {
  try {
    const response = await api.get('/affiliates', {
      params: {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: '*',
      },
    });
    
    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error fetching affiliate link by slug:', error.response?.data || error.message || error);
    return null;
  }
};


// Fetching brands for storefront from brands collection
export const getBrands = async (page = 1, pageSize = 10, sort = 'name:asc', filters = {}) => {
  try {
    // Build query parameters
    const queryParams = {
      sort,
      pagination: {
        page,
        pageSize,
      },
      populate: '*' // Make sure to populate all fields including image
    };

    // Add filters if they exist
    if (Object.keys(filters).length) {
      queryParams.filters = filters;
    }

    console.log('Fetching brands with URL:', `${api.defaults.baseURL}/brands`);
    console.log('Query params:', JSON.stringify(queryParams));

    const response = await api.get('/brands', {
      params: queryParams
    });
    
    // Return the data structure matching the same pattern as other API functions
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Error fetching brands:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      fullError: error
    });
    return { data: [], meta: { pagination: { page: 1, pageSize, total: 0 } } };
  }
};