import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import { getArticleBySlug } from '../../services/api';
import Layout from '../../components/Layout';

export default function ArticleDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      const articleData = await getArticleBySlug(slug);
      setArticle(articleData);
      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

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

  if (!article) {
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

  const { attributes } = article;
  const imageUrl = attributes.thumbnail.data.attributes.url;
  const publishDate = moment(attributes.publishDate).format('MMMM D, YYYY');

  return (
    <Layout
      title={attributes.title}
      description={attributes.excerpt || `Read ${attributes.title} on My Blog`}
    >
      <div className="container mx-auto px-4 py-8">

      <article className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to all articles
        </Link>

        <h1 className="text-4xl font-bold mb-4">{attributes.title}</h1>

        <div className="flex items-center space-x-4 mb-6">
          {attributes.author.data && (
            <div className="flex items-center">
              <span className="text-gray-700">By {attributes.author.data.attributes.name}</span>
            </div>
          )}
          <span className="text-gray-500">{publishDate}</span>
        </div>

        {imageUrl && (
          <div className="mb-8 relative h-96 w-full">
            <img
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${imageUrl}`}
              alt={attributes.thumbnail.data.attributes.alternativeText || attributes.title}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        )}

        <div className="prose max-w-none">
          <ReactMarkdown>{attributes.content}</ReactMarkdown>
        </div>

        {attributes.categories.data.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {attributes.categories.data.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.attributes.slug}`}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {category.attributes.name}
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