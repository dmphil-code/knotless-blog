"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticles, searchArticles } from './services/api';
import ArticleCard from './components/ArticleCard';
import HeroArticleCard from './components/HeroArticleCard';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine which data to display based on search state
  const displayedArticles = isSearching ? searchResults : articles;
  const displayedPagination = isSearching ? searchPagination : pagination;
  
  // Function to transform article data for ArticleCard
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
  
  return (
    <Layout onSearchSubmit={onSearchSubmit}>
      {/* Hero Section with Featured Articles - Only show when not searching */}
      {!isSearching && (
        <div className="hero-articles-wrapper">
          <div className="hero-articles-grid">
            {loading ? (
              // Loading placeholders for hero cards
              Array(3).fill().map((_, i) => (
                <div key={i} className="hero-card-container">
                  <div className="hero-article-card">
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div className="hero-overlay"></div>
                      <div className="hero-read-more">
                        LOADING...
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredArticles.length > 0 ? (
              // Map featuredArticles to HeroArticleCard components
              featuredArticles.map((article) => {
                const transformedArticle = transformArticleData(article);
                if (!transformedArticle) return null;
                
                return (
                  <div key={article.id} className="hero-card-container">
                    <HeroArticleCard 
                      article={transformedArticle}
                      darkTheme={true}
                    />
                  </div>
                );
              })
            ) : (
              // No featured articles available
              <div style={{
                gridColumn: 'span 3',
                textAlign: 'center',
                padding: '2rem 0',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p style={{ color: 'white' }}>No featured articles available</p>
              </div>
            )}
          </div>
        </div>
      )}      

  {/* Main Content Section */}
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