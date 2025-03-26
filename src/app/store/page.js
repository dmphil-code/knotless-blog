"use client"

import { useState, useEffect } from 'react';
import { getAffiliateLinks } from '../services/api';
import AffLinkCard from '../components/AffLinkCard';
import StoreLayout from '../components/StoreLayout';
import StoreHero from '../components/StoreHero';
import Pagination from '../components/Pagination';
import useWindowSize from '../../hooks/useWindowSize';

export default function StorePage() {
  const windowSize = useWindowSize();
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9, // 3x3 grid
    total: 0,
  });

  // Determine optimal grid columns based on screen width
  const getGridColumns = () => {
    const width = windowSize.width || 0;
    if (width >= 1200) return 3; // 3 columns on large screens
    if (width >= 768) return 2;  // 2 columns on medium screens
    return 1;                   // 1 column on small screens
  };

  // Fetch affiliate links from Strapi
  const fetchAffiliateLinks = async (page = 1) => {
    setLoading(true);
    try {
      const { data, meta } = await getAffiliateLinks(page, pagination.pageSize);
      
      if (data && data.length > 0) {
        setAffiliates(data);
      } else {
        setAffiliates([]);
      }
      
      setPagination(meta.pagination);
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
      setAffiliates([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    fetchAffiliateLinks(newPage);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  // Fetch affiliate links on component mount
  useEffect(() => {
    fetchAffiliateLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transform affiliate data to the structure expected by AffLinkCard
  const transformAffiliateData = (affiliate) => {
    if (!affiliate) {
      console.warn('Invalid affiliate data:', affiliate);
      return null;
    }
    
    return {
      id: affiliate.id,
      name: affiliate.name || 'Unnamed Affiliate',
      url: affiliate.url || '#',
      company: affiliate.company || '',
      slug: affiliate.slug || null,
      articles: affiliate.articles || [],
      categories: affiliate.categories || [],
      author: affiliate.author || null
    };
  };
  
  // Calculate max width based on grid columns
  const getMaxWidth = () => {
    const columns = getGridColumns();
    // Account for gap (30px) between cards
    if (columns === 1) return '320px'; // 1 card width
    if (columns === 2) return '670px'; // (320px * 2) + 30px gap
    return '1020px'; // (320px * 3) + (30px * 2) gaps
  };
  
  // Hero section title and description
  const heroTitle = "Our Affiliate Partners";
  const heroDescription = "Check out these great products and services we recommend";
  
  return (
    <StoreLayout>
      {/* Hero Section - Added at the top */}
      <StoreHero 
        title={heroTitle} 
        description={heroDescription} 
      />
      
      <div style={{ 
        maxWidth: '1200px', // Container max width
        margin: '0 auto',
        padding: '0 2rem 3rem'
      }}>
        {loading ? (
          // Loading state
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
            gap: '30px',
            justifyContent: 'center',
            margin: '0 auto',
            maxWidth: getMaxWidth()
          }}>
            {Array(Math.min(getGridColumns() * 3, 9)).fill().map((_, i) => (
              <div key={i} style={{
                width: '100%',
                aspectRatio: '1 / 1',
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}></div>
            ))}
          </div>
        ) : (
          affiliates.length > 0 ? (
            <>
              {/* Affiliate Links Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
                gap: '30px',
                justifyContent: 'center',
                margin: '0 auto',
                maxWidth: getMaxWidth()
              }}>
                {affiliates.map((affiliate) => {
                  const transformedAffiliate = transformAffiliateData(affiliate);
                  if (!transformedAffiliate) return null;
                  
                  return (
                    <AffLinkCard 
                      key={affiliate.id} 
                      affiliate={transformedAffiliate} 
                    />
                  );
                })}
              </div>
              
              {/* Pagination */}
              {pagination.total > pagination.pageSize && (
                <div style={{ marginTop: '3rem' }}>
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={Math.ceil(pagination.total / pagination.pageSize)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            // No affiliates available
            <div style={{
              textAlign: 'center',
              padding: '4rem 0',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <p style={{
                fontSize: '1.25rem',
                color: '#666',
                marginBottom: '1.5rem'
              }}>
                No affiliate links available at the moment.
              </p>
              <p style={{
                fontSize: '1rem',
                color: '#888'
              }}>
                Please check back later for recommendations.
              </p>
            </div>
          )
        )}
        
        {/* Disclaimer */}
        <div style={{
          margin: '4rem auto 1rem',
          padding: '1.5rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <p>
            <strong>Disclaimer:</strong> Some links on this page may be affiliate links. If you make a purchase through these links, we may earn a small commission at no extra cost to you.
          </p>
        </div>
      </div>
    </StoreLayout>
  );
}