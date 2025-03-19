"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleBySlug, getArticleById } from '../../services/api';
import ArticleLayout from '../../components/ArticleLayout';
import ReactMarkdown from 'react-markdown';

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
    img: ({ src, alt, ...props }) => {
      // Handle internal image URLs
      if (src && !src.startsWith('http')) {
        src = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${src}`;
      }
      return (
        <div style={{display: 'flex', justifyContent: 'center', margin: '2rem 0'}}>
          {/* Use regular img tag with warning suppressed by ESLint config */}
          <img 
            src={src} 
            alt={alt || ''} 
            style={{
              maxWidth: '100%', 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }} 
            {...props} 
          />
        </div>
      );
    },
    h1: ({ children }) => <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', margin: '2rem 0 1rem', color: '#444'}}>{children}</h1>,
    h2: ({ children }) => <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', margin: '1.75rem 0 1rem', color: '#444'}}>{children}</h2>,
    h3: ({ children }) => <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0 0.75rem', color: '#444'}}>{children}</h3>,
    p: ({ children }) => <p style={{margin: '1.25rem 0', lineHeight: '1.7', color: '#444', fontSize: '1.125rem'}}>{children}</p>,
    ul: ({ children }) => <ul style={{marginLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'disc'}}>{children}</ul>,
    ol: ({ children }) => <ol style={{marginLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'decimal'}}>{children}</ol>,
    li: ({ children }) => <li style={{marginBottom: '0.75rem', lineHeight: '1.6', color: '#444'}}>{children}</li>,
    a: ({ children, href }) => <a href={href} style={{color: '#E9887E', textDecoration: 'underline'}}>{children}</a>,
    strong: ({ children }) => <strong style={{fontWeight: 'bold', color: '#333'}}>{children}</strong>,
    blockquote: ({ children }) => <blockquote style={{
      borderLeft: '4px solid #E9887E',
      paddingLeft: '1.5rem',
      marginLeft: '0',
      marginRight: '0',
      marginTop: '1.5rem',
      marginBottom: '1.5rem',
      fontStyle: 'italic',
      color: '#555'
    }}>{children}</blockquote>
  };

  return (
    <ArticleLayout>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Back link positioned above the main title */}
        <Link 
          href="/" 
          style={{ 
            color: '#E9887E', 
            textDecoration: 'none', 
            display: 'inline-block', 
            marginBottom: '2rem',
            fontWeight: '500'
          }}
        >
          ← Back to all articles
        </Link>

        {/* Single main title */}
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem', 
          textAlign: 'center',
          color: '#333'
        }}>
          {article.title}
        </h1>

        {/* Author and date stacked vertically */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          marginBottom: '2rem' 
        }}>
          {article.author && (
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#555', fontWeight: '500' }}>{article.author.name}</span>
            </div>
          )}
          <span style={{ color: '#777' }}>{publishDate}</span>
        </div>

        {/* Centered thumbnail image */}
        {article.thumbnail && article.thumbnail.url && (
          <div style={{ 
            marginBottom: '2.5rem', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            <img
              src={article.thumbnail.url.startsWith('http') 
                ? article.thumbnail.url 
                : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.thumbnail.url}`}
                alt={article.title}
              style={{ 
                borderRadius: '12px', 
                maxHeight: '450px', 
                maxWidth: '100%',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            />
          </div>
        )}

        {/* Article content with proper styling - Using content field */}
        <div style={{ margin: '0 auto' }} className="markdown-content">
          {article.content ? (
            <ReactMarkdown components={components}>
              {article.content}
            </ReactMarkdown>
          ) : (
            <p>No content available for this article.</p>
          )}
        </div>

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
              color: '#444'
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
                    padding: '0.5rem 1rem', 
                    borderRadius: '2rem', 
                    fontSize: '0.875rem',
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
      </article>
    </ArticleLayout>
  );
}