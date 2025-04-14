/**
 * src/app/utils/richTextProcessor.js
 * Utility functions to process rich text content from Strapi
 */

/**
 * Process a rich text block from Strapi into Markdown format
 * @param {Array|null} content - The content from the Strapi rich text field
 * @returns {String} - Markdown formatted content
 */
export function processRichTextContent(content) {
    // If content is null or undefined, return empty string
    if (!content) {
      return '';
    }
    
    // If content is an array (from rich text editor), process it
    if (Array.isArray(content)) {
      return content
        .map(block => {
          return processRichTextBlock(block);
        })
        .filter(text => text) // Remove empty blocks
        .join('\n\n'); // Join blocks with double line breaks
    }
    
    // If content is unexpectedly a string (shouldn't happen with new structure)
    if (typeof content === 'string') {
      console.warn('Received string content instead of rich text blocks:', content);
      return content;
    }
    
    // If we don't recognize the format, return empty string
    console.warn('Unrecognized content format:', content);
    return '';
  }
  
  /**
   * Process a single rich text block
   * @param {Object} block - A block from the rich text content
   * @returns {String} - Markdown formatted block content
   */
  function processRichTextBlock(block) {
    // Handle null or undefined blocks
    if (!block) return '';
    
    // Handle different block types
    switch (block.type) {
      case 'paragraph':
        return processParagraph(block);
      
      case 'heading':
        return processHeading(block);
      
      case 'list':
        return processList(block);
      
      case 'image':
        return processImage(block);
      
      case 'code':
        return processCode(block);
      
      case 'quote':
        return processQuote(block);
      
      case 'link':
        return processLink(block);
      
      // If the block has simple text content
      default:
        if (block.text) {
          return block.text;
        }
        
        // Log unknown block types for debugging
        console.warn('Unknown block type:', block);
        return '';
    }
  }
  
  /**
   * Process a paragraph block
   */
  function processParagraph(block) {
    if (!block.children || !Array.isArray(block.children)) {
      return '';
    }
    
    return block.children
      .map(child => {
        let text = child.text || '';
        
        // Apply text styling
        if (child.bold) text = `**${text}**`;
        if (child.italic) text = `*${text}*`;
        if (child.underline) text = `<u>${text}</u>`;
        if (child.strikethrough) text = `~~${text}~~`;
        if (child.code) text = `\`${text}\``;
        
        return text;
      })
      .join('');
  }
  
  /**
   * Process a heading block
   */
  function processHeading(block) {
    if (!block.children || !Array.isArray(block.children)) {
      return '';
    }
    
    const level = block.level || 1;
    const headerMarker = '#'.repeat(level);
    const text = block.children.map(child => child.text || '').join('');
    
    return `${headerMarker} ${text}`;
  }
  
  /**
   * Process a list block
   */
  function processList(block) {
    if (!block.children || !Array.isArray(block.children)) {
      return '';
    }
    
    const listMarker = block.format === 'ordered' ? '1. ' : '- ';
    
    return block.children
      .map(item => {
        if (!item.children || !Array.isArray(item.children)) {
          return `${listMarker}`;
        }
        
        const text = item.children.map(child => child.text || '').join('');
        return `${listMarker}${text}`;
      })
      .join('\n');
  }
  
  /**
   * Process an image block
   */
  function processImage(block) {
    // Handle older Strapi format where image data is nested
    if (block.image && block.image.url) {
      const alt = block.image.alternativeText || block.image.caption || '';
      return `![${alt}](${block.image.url})`;
    }
    
    // Handle newer Strapi format where data is directly on block
    if (block.url) {
      const alt = block.alternativeText || block.caption || '';
      return `![${alt}](${block.url})`;
    }
    
    return '';
  }
  
  /**
   * Process a code block
   */
  function processCode(block) {
    if (!block.children || !Array.isArray(block.children)) {
      return '```\n```';
    }
    
    const code = block.children.map(child => child.text || '').join('');
    const language = block.language || '';
    
    return `\`\`\`${language}\n${code}\n\`\`\``;
  }
  
  /**
   * Process a quote block
   */
  function processQuote(block) {
    if (!block.children || !Array.isArray(block.children)) {
      return '> ';
    }
    
    const text = block.children.map(child => child.text || '').join('');
    return `> ${text}`;
  }
  
  /**
   * Process a link block
   */
  function processLink(block) {
    if (!block.children || !Array.isArray(block.children)) {
      return '';
    }
    
    const text = block.children.map(child => child.text || '').join('');
    const url = block.url || '#';
    
    return `[${text}](${url})`;
  }