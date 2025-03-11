"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleBySlug, getArticleById } from '../../services/api';
import Layout from '../../components/Layout';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if slug is a number (ID) or string (slug)
  const isId = !isNaN(Number(slug));

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        console.log(`Fetching article by ${isId ? 'ID' : 'slug'}: ${slug}`);
        
        let articleData;
        if (isId) {
          // Fetch by ID if slug is a number
          articleData = await getArticleById(Number(slug));
        } else {
          // Fetch by slug
          articleData = await getArticleBySlug(slug);
        }
        
        console.log('Article data:', articleData);
        
        if (!articleData) {
          setError('Article not found');
        } else {
          setArticle(articleData);
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

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout title="Article Not Found">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-xl mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Homepage
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Access properties directly from the article object (no attributes field)
  const imageUrl = article.thumbnail?.url;
  const publishDate = article.publishDate 
    ? new Date(article.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';

  return (
    <Layout
      title={article.title || 'Article'}
      description={article.excerpt || `Read this article on My Blog`}
    >
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            &larr; Back to all articles
          </Link>

          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center space-x-4 mb-6">
            {article.author && (
              <div className="flex items-center">
                <span className="text-gray-700">By {article.author.name}</span>
              </div>
            )}
            <span className="text-gray-500">{publishDate}</span>
          </div>

          {imageUrl && (
            <div className="mb-8 relative h-96 w-full">
              <img
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${imageUrl}`}
                alt={article.thumbnail?.alternativeText || article.title}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          )}

          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: 
              Array.isArray(article.content) 
                ? article.content.map(block => block.text || '').join('\n') 
                : article.content 
            }}
          />

          {article.categories?.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {article.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
}