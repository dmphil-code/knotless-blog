"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticles, searchArticles } from './services/api';
import ArticleCard from './components/ArticleCard';
import Pagination from './components/Pagination';
import Layout from './components/Layout';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPagination, setSearchPagination] = useState({
    page: 1,
    pageSize: 9,
    total: 0,
  });

  // Fetch regular articles
  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const { data, meta } = await getArticles(page, pagination.pageSize);
      console.log('Fetched articles data structure:', data);
      
      // Split articles - first 3 for hero section, rest for grid
      if (data && data.length > 0) {
        const splitPoint = Math.min(3, data.length);
        setFeaturedArticles(data.slice(0, splitPoint));
        setArticles(data.slice(splitPoint));
      } else {
        setFeaturedArticles([]);
        setArticles([]);
      }
      
      setPagination(meta.pagination);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setFeaturedArticles([]);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = async (query, page = 1) => {
    if (!query.trim()) {
      setIsSearching(false);
      fetchArticles(1);
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    
    try {
      const { data, meta } = await searchArticles(query, page, searchPagination.pageSize);
      setSearchResults(data);
      setSearchPagination(meta.pagination);
    } catch (error) {
      console.error("Error searching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit search from the layout component
  const onSearchSubmit = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // Handle page change for regular articles
  const handlePageChange = (newPage) => {
    if (isSearching) {
      handleSearch(searchQuery, newPage);
    } else {
      fetchArticles(newPage);
    }
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchArticles();
    // We need the dependency array empty to avoid re-fetching on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine which data to display based on search state
  const displayedArticles = isSearching ? searchResults : articles;
  const displayedPagination = isSearching ? searchPagination : pagination;
  
  // Function to transform article data for display
  const transformArticleData = (article) => {
    if (!article) {
      console.warn('Invalid article data:', article);
      return null;
    }
    
    let imageUrl = null;
    if (article.thumbnail && article.thumbnail.url) {
      // Check if URL already starts with http (absolute URL)
      if (article.thumbnail.url.startsWith('http')) {
        imageUrl = article.thumbnail.url;
      } else {
        // Otherwise prepend the Strapi URL
        imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.thumbnail.url}`;
      }
    }
  
    return {
      id: article.id,
      slug: article.slug || null,
      title: article.title || 'Untitled Article',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image: imageUrl,
      publishDate: article.publishDate || null,
      author: article.author || null,
      categories: article.categories || []
    };
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Layout onSearchSubmit={onSearchSubmit}>
      {/* Hero Section with Featured Articles */}
      {!isSearching && (
        <>
          {/* Blog Title Section */}
          <div style={{
            textAlign: 'center',
            padding: '20px 0 40px'
          }}>
            {/* <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'white'
            }}>
              Latest from Our Blog
            </h1>
            <p style={{
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              Discover the latest trends, tips, and stories in hair care and styling
            </p> */}
          </div>
          
          {/* Featured Articles Grid */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            {loading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px'
              }}>
                <p style={{
                  fontSize: '1.25rem',
                  color: 'white'
                }}>Loading featured articles...</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '30px',
              }}>
                {featuredArticles.length > 0 ? (
                  featuredArticles.map((article) => {
                    const transformedArticle = transformArticleData(article);
                    if (!transformedArticle) return null;
                    
                    // Construct the article link path
                    const linkPath = transformedArticle.slug 
                      ? `/articles/${transformedArticle.slug}` 
                      : `/articles/${transformedArticle.id}`;
                    
                    return (
                      <div key={transformedArticle.id} style={{
                        position: 'relative',
                        height: '400px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        transition: 'transform 0.3s ease',
                      }}>
                        {/* Article Image */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          zIndex: 1,
                        }}>
                          {transformedArticle.image ? (
                            <img 
                              src={transformedArticle.image} 
                              alt={transformedArticle.title}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(to right, #F4B637, #E9887E)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}></div>
                          )}
                          
                          {/* Dark overlay for better text visibility */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                            zIndex: 2
                          }}></div>
                        </div>
                        
                        {/* Article Title Box - Hovering over the image */}
                        <div style={{
                          position: 'absolute',
                          bottom: '30px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '80%',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          padding: '20px',
                          borderRadius: '6px',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                          zIndex: 3,
                          textAlign: 'center'
                        }}>
                          {/* Category if available */}
                          {transformedArticle.categories && transformedArticle.categories.length > 0 && (
                            <span style={{
                              color: '#E9887E',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              marginBottom: '8px',
                              display: 'block'
                            }}>
                              {transformedArticle.categories[0].name}
                            </span>
                          )}
                          
                          {/* Article Title */}
                          <h2 style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            marginBottom: '10px',
                            color: '#333',
                            lineHeight: 1.3
                          }}>
                            {transformedArticle.title}
                          </h2>
                          
                          {/* Date if available */}
                          {transformedArticle.publishDate && (
                            <p style={{
                              fontSize: '0.85rem',
                              color: '#666',
                              margin: '0'
                            }}>
                              {formatDate(transformedArticle.publishDate)}
                            </p>
                          )}
                        </div>
                        
                        {/* Clickable Link Overlay */}
                        <Link 
                          href={linkPath}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 4,
                            cursor: 'pointer'
                          }}
                          aria-label={`Read article: ${transformedArticle.title}`}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div style={{
                    gridColumn: 'span 3',
                    textAlign: 'center',
                    padding: '2rem 0'
                  }}>
                    <p style={{ color: 'white' }}>No featured articles available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Main Content Section with Article Grid */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 2rem'
      }}>
        {isSearching && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Search results for &quot;{searchQuery}&quot;
            </h2>
            <p style={{ color: '#666' }}>
              Found {displayedPagination.total} article{displayedPagination.total !== 1 ? 's' : ''}
            </p>
            {displayedArticles.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0'
              }}>
                <p style={{
                  fontSize: '1.25rem',
                  marginBottom: '1rem'
                }}>No articles found for &quot;{searchQuery}&quot;</p>
                <button 
                  onClick={() => {
                    setIsSearching(false);
                    setSearchQuery('');
                    fetchArticles(1);
                  }}
                  style={{
                    color: '#E9887E',
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Return to all articles
                </button>
              </div>
            )}
          </div>
        )}

        {!isSearching && (
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            marginBottom: '2.5rem',
            color: '#333',
            textAlign: 'center'
          }}>
            Explore More Articles
          </h2>
        )}

        {loading && !isSearching ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px'
          }}>
            {Array(6).fill().map((_, i) => (
              <div key={i} style={{
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#f5f5f5',
                height: '350px'
              }}>
                <div style={{ height: '200px', backgroundColor: '#eee' }}></div>
                <div style={{ padding: '20px' }}>
                  <div style={{ height: '24px', backgroundColor: '#ddd', marginBottom: '15px', width: '80%' }}></div>
                  <div style={{ height: '16px', backgroundColor: '#ddd', marginBottom: '8px', width: '100%' }}></div>
                  <div style={{ height: '16px', backgroundColor: '#ddd', marginBottom: '15px', width: '70%' }}></div>
                  <div style={{ height: '30px', backgroundColor: '#ddd', width: '40%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          displayedArticles.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '30px'
            }}>
              {displayedArticles.map((article) => {
                const transformedArticle = transformArticleData(article);
                if (!transformedArticle) return null;
                
                // Use the ArticleCard component for the grid display
                return (
                  <ArticleCard 
                    key={article.id} 
                    article={transformedArticle} 
                  />
                );
              })}
            </div>
          ) : !isSearching && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 0'
            }}>
              <p style={{
                fontSize: '1.25rem',
                color: '#666',
                marginBottom: '1.5rem'
              }}>
                No articles available at the moment.
              </p>
              <p style={{
                fontSize: '1rem',
                color: '#888'
              }}>
                Please check back later for new content.
              </p>
            </div>
          )
        )}

        {displayedArticles.length > 0 && displayedPagination.total > displayedPagination.pageSize && (
          <div style={{ marginTop: '3rem' }}>
            <Pagination
              currentPage={displayedPagination.page}
              totalPages={Math.ceil(displayedPagination.total / displayedPagination.pageSize)}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}