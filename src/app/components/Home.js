"use client"

import { useState, useEffect } from 'react';
import { getArticles } from './services/api';
import ArticleCard from './components/ArticleCard';
import Layout from './components/Layout';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchArticles();
  }, []);

  return (
    <Layout title="Our Blog">
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            // Loading placeholders
            Array(3).fill().map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-md overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              </div>
            ))
          ) : (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}