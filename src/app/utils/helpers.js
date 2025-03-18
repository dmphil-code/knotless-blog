// utils/helpers.js

/**
 * Format a date string in the "MMM DD, YYYY" format (e.g., "Mar 22, 2023")
 * @param {string} dateString - ISO date string
 * @return {string} Formatted date
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  /**
   * Calculate reading time based on content length
   * @param {string} content - Article content
   * @return {string} Reading time in minutes
   */
  export const calculateReadingTime = (content) => {
    if (!content) return '1 min read';
    
    // Average reading speed: 225 words per minute
    const wordsPerMinute = 225;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    
    return `${readingTime} min read`;
  };