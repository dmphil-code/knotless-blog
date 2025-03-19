import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { searchArticles } from '../../services/api';
import ArticleCard from '../../components/ArticleCard';
import Pagination from '../../components/Pagination';
import Layout from '../components/Layout';

export default function Search() {
  const router = useRouter();
  const { q, page } = router.query;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      const currentPage = page ? parseInt(page) : 1;
      performSearch(q, currentPage);
    }
    // q and page are from URL params, so they should be included in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page]);

  const performSearch = async (query, currentPage = 1) => {
    setLoading(true);
    const { data, meta } = await searchArticles(query, currentPage, pagination.pageSize);
    setArticles(data);
    setPagination(meta.pagination);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePageChange = (newPage) => {
    router.push(`/search?q=${encodeURIComponent(q)}&page=${newPage}`);
  };

  return (
    <Layout
      title={q ? `Search results for "${q}"` : 'Search Articles'}
      description={q ? `Search results for "${q}" on My Blog` : 'Search for articles on My Blog'}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Search Articles</h1>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>

      {q && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {loading ? 'Searching...' : `Search results for "${q}"`}
          </h2>
          <p className="text-gray-600">
            {!loading && `Found ${pagination.total} article${pagination.total !== 1 ? 's' : ''}`}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading results...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {articles.length === 0 && q && (
            <div className="text-center py-12">
              <p className="text-xl mb-4">No articles found for &quot;{q}&quot;</p>
              <p className="text-gray-600 mb-6">Try different keywords or browse all articles</p>
              <Link href="/" className="text-blue-600 hover:underline">
                Return to Homepage
              </Link>
            </div>
          )}

          {articles.length > 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(pagination.total / pagination.pageSize)}
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