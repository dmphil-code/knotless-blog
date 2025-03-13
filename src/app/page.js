"use client"

import { useState, useEffect } from 'react';
import { getArticles, searchArticles } from './services/api';
import ArticleCard from './components/ArticleCard';
import Pagination from './components/Pagination';
import Layout from './components/Layout';

export default function Home() {
  const [articles, setArticles] = useState([]);
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
      setArticles(data);
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
      image: imageUrl
    };
  };
  
  return (
    <Layout
      title={isSearching ? `Search results for "${searchQuery}"` : "Latest Articles"}
      description={isSearching ? `Search results for "${searchQuery}"` : "Read our latest blog articles on various topics"}
      onSearchSubmit={onSearchSubmit}
    >
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading articles...</p>
          </div>
        ) : (
          <>
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
                      className="text-blue-600 hover:underline"
                    >
                      Return to all articles
                    </button>
                  </div>
                )}
              </div>
            )}

            {displayedArticles.length > 0 && (
              <div className="grid">
                {displayedArticles.map((article) => {
                  const transformedArticle = transformArticleData(article);
                  if (!transformedArticle) return null;
                  return <ArticleCard key={article.id} article={transformedArticle} />;
                })}
              </div>
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
          </>
        )}
      </div>
    </Layout>
  );
}