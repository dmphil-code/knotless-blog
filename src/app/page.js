"use client"

import { useState, useEffect } from 'react';
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
      if (data.length > 0) {
        setFeaturedArticles(data.slice(0, 3));
        setArticles(data.slice(3));
      } else {
        setFeaturedArticles([]);
        setArticles([]);
      }
      
      setPagination(meta.pagination);
    } catch (error) {
      console.error("Error fetching articles:", error);
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
  
  // Function to transform article data for ArticleCard
  const transformArticleData = (article) => {
    if (!article) {
      console.warn('Invalid article data:', article);
      return null;
    }
    
    console.log('Processing article:', article.id, article);
    
    // Debug the actual thumbnail structure
    console.log('Thumbnail data:', article.thumbnail);
    
    let imageUrl = null;
    if (article.thumbnail && article.thumbnail.url) {
      // Check if URL already starts with http (absolute URL)
      if (article.thumbnail.url.startsWith('http')) {
        imageUrl = article.thumbnail.url;
      } else {
        // Otherwise prepend the Strapi URL
        imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.thumbnail.url}`;
      }
      console.log('Constructed image URL:', imageUrl);
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
    <Layout
      title={isSearching ? `Search results for "${searchQuery}"` : null}
      description={isSearching ? null : null}
      onSearchSubmit={onSearchSubmit}
    >
      {!isSearching && (
        <section className="hero-section" style={{ 
          padding: '40px 0', 
          backgroundColor: '#FFF',
        }}>
          <div className="container mx-auto px-4">
            <h1 className="page-title" style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              marginBottom: '2rem',
              color: '#333',
              textAlign: 'center'
            }}>
              Latest from Our Blog
            </h1>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-xl">Loading featured articles...</p>
              </div>
            ) : (
              <div className="hero-articles" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '30px',
                marginBottom: '60px',
              }}>
                {featuredArticles.length > 0 ? (
                  featuredArticles.map((article) => {
                    const transformedArticle = transformArticleData(article);
                    if (!transformedArticle) return null;
                    return (
                      <HeroArticleCard 
                        key={article.id} 
                        article={transformedArticle} 
                      />
                    );
                  })
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p>No featured articles available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        {isSearching && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Search results for &quot;{searchQuery}&quot;
            </h2>
            <p className="text-gray-600">
              Found {displayedPagination.total} article{displayedPagination.total !== 1 ? 's' : ''}
            </p>
            {displayedArticles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xl mb-4">No articles found for &quot;{searchQuery}&quot;</p>
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

        {!isSearching && !loading && (
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#333'
          }}>
            Explore More Articles
          </h2>
        )}

        {loading && !isSearching ? (
          <div className="grid" style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px'
          }}>
            {Array(6).fill().map((_, i) => (
              <div key={i} className="article-card" style={{
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
          displayedArticles.length > 0 && (
            <div className="grid" style={{
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
          )
        )}

        {displayedArticles.length > 0 && (
          <div className="mt-12">
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