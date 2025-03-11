"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticles } from './services/api';
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

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const { data, meta } = await getArticles(page, pagination.pageSize);
      setArticles(data);
      setPagination(meta.pagination);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handlePageChange = (newPage) => {
    fetchArticles(newPage);
  };

  return (
    <Layout
      title="Latest Articles"
      description="Read our latest blog articles on various topics"
    >
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading articles...</p>
          </div>
        ) : (
          <>
            <div className="grid">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl">No articles found</p>
              </div>
            )}

            <div className="mt-12">
              <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(pagination.total / pagination.pageSize)}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}