"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleBySlug, getArticleById, getArticles } from '../../services/api';
import ArticleLayout from '../../components/ArticleLayout';
import ReactMarkdown from 'react-markdown';
import useWindowSize from '../../hooks/useWindowSize';
import { processRichTextContent } from '../../utils/richTextProcessor';
import AffLinkCard from '../../components/AffLinkCard';
import ImageTextWrap from '../../components/ImageTextWrap';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const windowSize = useWindowSize();
  const [prevArticle, setPrevArticle] = useState(null);
  const [nextArticle, setNextArticle] = useState(null);
  // State to track hover state for buttons
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);
  
  // Check if slug is a number (ID) or string (slug)
  const isId = !isNaN(Number(slug));

  // Fetch article data
  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        let articleData;
        if (isId) {
          // Fetch by ID if slug is a number
          articleData = await getArticleById(Number(slug));
        } else {
          // Fetch by slug
          articleData = await getArticleBySlug(slug);
        }
        
        if (!articleData) {
          setError('Article not found');
        } else {
          setArticle(articleData);
          
          // Fetch all articles to determine prev/next
          fetchAdjacentArticles(articleData.id);
        }
      } catch (err) {
        setError('Error loading article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, isId]);

  // Fetch adjacent articles for navigation
  const fetchAdjacentArticles = async (currentId) => {
    try {
      // Get all articles
      const { data: allArticles } = await getArticles(1, 100);
      
      if (!allArticles || allArticles.length === 0) return;
      
      // Sort articles by ID for consistent navigation
      const sortedArticles = [...allArticles].sort((a, b) => a.id - b.id);
      
      // Find current article index
      const currentIndex = sortedArticles.findIndex(article => article.id === currentId);
      
      if (currentIndex === -1) return;
      
      // Get previous article (or last if at beginning)
      const prevIndex = currentIndex === 0 ? sortedArticles.length - 1 : currentIndex - 1;
      setPrevArticle(sortedArticles[prevIndex]);
      
      // Get next article (or first if at end)
      const nextIndex = currentIndex === sortedArticles.length - 1 ? 0 : currentIndex + 1;
      setNextArticle(sortedArticles[nextIndex]);
      
    } catch (error) {
      console.error("Error fetching adjacent articles:", error);
    }
  };

  // Get author image URL
  const getAuthorImageUrl = () => {
    if (!article || !article.author || !article.author.picture || !article.author.picture.url) return null;
    return article.author.picture.url;
  };

  if (loading) {
    return (
      <ArticleLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <p style={{ fontSize: '1.25rem', color: '#666' }}>Loading article...</p>
        </div>
      </ArticleLayout>
    );
  }

  if (error || !article) {
    return (
      <ArticleLayout>
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E9887E' }}>
            Article Not Found
          </h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#666' }}>
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/" style={{ 
            backgroundColor: '#E9887E', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '2rem', 
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Return to Homepage
          </Link>
        </div>
      </ArticleLayout>
    );
  }

  // Parse the date
  const publishDate = article.publishDate 
    ? new Date(article.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';

  // Custom component mapping for ReactMarkdown
  const components = {
    // IMPORTANT: Fix for the HTML validation error - img can't contain div
    img: ({ src, alt, ...props }) => {
      // Create smaller images with rounded corners
      return (
        <span className="article-image-wrapper" style={{
          display: 'block',
          margin: '2rem auto',
          maxWidth: '450px', // Increased to match wider content column
          textAlign: 'center',
        }}>
          <img 
            src={src} 
            alt={alt || ''} 
            style={{
              width: '100%', 
              height: 'auto',
              borderRadius: '12px', // Rounded corners
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              border: '5px solid white',
              maxHeight: '450px', // Increased to maintain proportion
              objectFit: 'cover',
            }} 
            {...props}  
          />
        </span>
      );
    },
    h1: ({ children }) => <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', margin: '2rem 0 1rem', color: '#444', fontFamily: "'Bauhaus Soft Display', sans-serif" }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', margin: '1.75rem 0 1rem', color: '#444', fontFamily: "'Bauhaus Soft Display', sans-serif" }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0 0.75rem', color: '#444', fontFamily: "'Bauhaus Soft Display', sans-serif" }}>{children}</h3>,
    p: ({ children }) => <p style={{margin: '1.25rem 0', lineHeight: '1.7', color: '#444', fontSize: '1.125rem'}}>{children}</p>,
    ul: ({ children }) => <ul style={{marginLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'disc'}}>{children}</ul>,
    ol: ({ children }) => <ol style={{marginLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'decimal'}}>{children}</ol>,
    li: ({ children }) => <li style={{marginBottom: '0.75rem', lineHeight: '1.6', color: '#444'}}>{children}</li>,
    a: ({ children, href }) => <a href={href} style={{color: '#E9887E', textDecoration: 'underline'}}>{children}</a>,
    strong: ({ children }) => <strong style={{fontWeight: 'bold', color: '#333'}}>{children}</strong>,
    blockquote: ({ children }) => <blockquote style={{
      margin: '24px 0',
      padding: '20px 40px',
      backgroundColor: '#FFF8F0',
      borderRadius: '8px',
      textAlign: 'center',
      fontFamily: "'Bauhaus Soft Display', sans-serif",
      fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '1.75rem' :  windowSize < 1200 ? '2.5rem' : '2.75rem', 
      fontWeight: '600',
      color: '#773800',
      lineHeight: '1.3',
      marginBottom: '10px'
      }}>
      {children}</blockquote>
  };

  return (
    <ArticleLayout>
      <div style={{ position: 'relative', width: '100%', backgroundColor: '#FFE8C9',
        
       }}>
        {/* Main content container */}
        <div style={{ 
          maxWidth: '1000px',
          margin: '-2rem auto',
          padding: '40px 20px 60px',
          position: 'relative'
        }}>
          {/* Breadcrumb navigation - increased spacing */}
          <div style={{ marginBottom: '60px' }}>
            <Link 
              href="/" 
              style={{ 
                color: '#E9887E',
                textDecoration: 'none', 
                display: 'flex',
                alignItems: 'center',
                fontWeight: '500',
                fontSize: '1rem',
              }}
            >
              <span style={{ marginRight: '6px' }}>←</span> Back to all articles
            </Link>
          </div>
          
          {/* Article title section */}
          <div style={{ position: 'relative', marginBottom: '50px' }}>
            {/* Title container - centered */}
            <div style={{ 
              textAlign: 'center',
              margin: '0 auto',
              width: '100%',
              maxWidth: '850px'
            }}>
              <h1 style={{ 
                color: '#773800',
                fontFamily: 'Bauhaus Soft Display, sans-serif',
                fontSize: windowSize.width < 768 ? '2.5rem' : '3.5rem',
                fontWeight: '700',
                marginBottom: '30px',
                lineHeight: '1.2',
              }}>
                {article.title.toUpperCase()}
              </h1>
              
              {/* Author and date container with image */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '40px',
              }}>
                {/* Author image column */}
                {getAuthorImageUrl() && (
                  <div style={{
                    marginRight: '15px',
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      border: '3px solid white',
                    }}>
                      <img
                        src={getAuthorImageUrl()}
                        alt={article.author.name || 'Author'}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Author info column */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  alignItems: getAuthorImageUrl() ? 'flex-start' : 'center',
                }}>
                  {article.author && article.author.name && (
                    <p style={{ 
                      color: '#773800',
                      fontFamily: 'Bauhaus Soft Display, sans-serif',
                      fontSize: windowSize.width < 768 ? '1.1rem' : '1.25rem',
                      fontWeight: '500',
                      margin: 0,
                    }}>
                      {article.author.name}
                    </p>
                  )}
                  
                  <p style={{ 
                    color: '#773800',
                    fontFamily: 'Bauhaus Soft Display, sans-serif',
                    fontSize: windowSize.width < 768 ? '0.9rem' : '1rem',
                    margin: 0,
                  }}>
                    {publishDate}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation buttons - evenly spaced across full width */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              maxWidth: '850px',
              margin: '0 auto 50px',
              padding: '0'
            }}>
              {/* Previous Article button */}
              <div 
                className="nav-button-container"
                onMouseEnter={() => setPrevHovered(true)}
                onMouseLeave={() => setPrevHovered(false)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Link 
                  href={prevArticle ? `/articles/${prevArticle.slug || prevArticle.id}` : '/'}
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#773800',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '2rem',
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #773800',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    width: prevHovered && prevArticle ? 'auto' : 'auto',
                    maxWidth: prevHovered && prevArticle ? '300px' : '170px',
                    overflow: 'hidden'
                  }}
                >
                  <span style={{ marginRight: '8px' }}>←</span> 
                  {prevHovered && prevArticle ? (
                    <span style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}>
                      {prevArticle.title}
                    </span>
                  ) : (
                    'Previous Article'
                  )}
                </Link>
              </div>
              
              {/* Store button */}
              <div
                style={{ 
                  backgroundColor: '#E9887E',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  textAlign: 'center'
                }}
              >
                Store - Coming Soon
              </div>
              
              {/* Next Article button */}
              <div 
                className="nav-button-container"
                onMouseEnter={() => setNextHovered(true)}
                onMouseLeave={() => setNextHovered(false)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'right'
                }}
              >
                <Link 
                  href={nextArticle ? `/articles/${nextArticle.slug || nextArticle.id}` : '/'}
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#773800',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '2rem',
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    border: '1px solid #773800',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    width: nextHovered && nextArticle ? 'auto' : 'auto',
                    maxWidth: nextHovered && nextArticle ? '300px' : '170px',
                    overflow: 'hidden'
                  }}
                >
                  {nextHovered && nextArticle ? (
                    <span style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}>
                      {nextArticle.title}
                    </span>
                  ) : (
                    'Next Article'
                  )}
                  <span style={{ marginLeft: '8px' }}>→</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main article content - centered */}
          <div style={{ 
            maxWidth: '850px', 
            margin: '0 auto', 
            position: 'relative'
          }}>
            {/* Article content with image wrap */}
          {article.content ? (
            <div className="article-content">
              {(() => {
                try {
                  // Process the rich text content
                  const processedContent = processRichTextContent(article.content);
                  
                  // Check for title in the content and remove it if present
                  let contentWithoutTitle = processedContent;
                  
                  // If there's a title in H1 format at the beginning, remove it
                  if (contentWithoutTitle && typeof contentWithoutTitle === 'string' && contentWithoutTitle.startsWith('# ')) {
                    // Remove the first line if it's a title
                    contentWithoutTitle = contentWithoutTitle
                      .split('\n')
                      .slice(1)
                      .join('\n')
                      .trim();
                  }
                  
                  // Get the image URL for the thumbnail
                  const imageUrl = article.thumbnail && article.thumbnail.url ? article.thumbnail.url : null;
                  
                  // Simple content display with image wrap at the beginning
                  if (contentWithoutTitle && typeof contentWithoutTitle === 'string') {
                    if (imageUrl) {
                      return (
                        <ImageTextWrap 
                          image={imageUrl} 
                          alt={article.title || 'Article image'}
                          imageWidth="40%" 
                          imageMargin="0 20px 15px 0"
                        >
                          <ReactMarkdown components={components}>
                            {contentWithoutTitle}
                          </ReactMarkdown>
                        </ImageTextWrap>
                      );
                    } else {
                      return (
                        <ReactMarkdown components={components}>
                          {contentWithoutTitle}
                        </ReactMarkdown>
                      );
                    }
                  } else {
                    return (
                      <p style={{ color: '#666' }}>
                        No content available for this article.
                      </p>
                    );
                  }
                } catch (error) {
                  console.error("Error rendering article content:", error);
                  return (
                    <div style={{ padding: '2rem 0' }}>
                      <p style={{ color: '#666' }}>
                        There was an error rendering this article content. Please try again later.
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                This article has no content.
              </p>
            </div>
          )}
            
            {/* Products We Love section - in a colored container between sections 2 and 3 */}
            {article.affiliates && article.affiliates.length > 0 && (
              <div style={{
                marginBottom: '70px',
                padding: '30px',
                backgroundColor: '#FFF8F0', // Same as excerpt
                borderRadius: '8px',
              }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  marginBottom: '1.5rem',
                  color: '#773800',
                  fontFamily: "'Bauhaus Soft Display', sans-serif",
                  textAlign: 'left'
                }}>Products We Love</h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: '20px',
                  justifyContent: 'flex-start'
                }}>
                  {article.affiliates.slice(0, 3).map((affiliate, index) => (
                    <div key={affiliate.id} style={{
                      height: '200px',
                      width: article.affiliates.length === 1 
                        ? '280px' 
                        : windowSize.width < 768 
                          ? '100%' 
                          : `calc(${100 / Math.min(article.affiliates.length, 3)}% - ${article.affiliates.length > 1 ? '15px' : '0px'})`
                    }}>
                      <AffLinkCard 
                        affiliate={{
                          id: affiliate.id,
                          name: affiliate.name || 'Recommended Product',
                          url: affiliate.url || '#',
                          company: affiliate.company || '',
                          image: affiliate.image?.url || null,
                          brand: affiliate.brand || null
                        }}
                        isWrappedInLink={true} // This makes the card non-clickable
                        onClick={null} // Ensure no click action 
                      />
                    </div>
                  ))}
                </div>
                
                {article.affiliates.length > 3 && (
                  <div style={{ marginTop: '15px' }}>
                    <Link 
                      href="/store" 
                      style={{
                        display: 'inline-block',
                        color: '#E9887E',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      View all recommended products →
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Categories */}
            {article.categories && article.categories.length > 0 && (
              <div style={{ 
                marginTop: '3rem', 
                paddingTop: '1.5rem', 
                borderTop: '1px solid #eee'
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  marginTop:'1rem',
                  color: '#444',
                  fontFamily: "'Bauhaus Soft Display', sans-serif"
                }}>Categories</h2>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem' 
                }}>
                  {article.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug || category.id}`}
                      style={{ 
                        backgroundColor: '#FFE8C9', 
                        color: '#773800',
                        padding: windowSize.width < 480 ? '0.4rem 0.8rem' : '0.5rem 1rem', 
                        borderRadius: '2rem', 
                        fontSize: windowSize.width < 480 ? '0.8rem' : '0.875rem',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}