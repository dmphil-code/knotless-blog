"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAffiliateLinks, getBrands } from '../../../services/api';
import AffLinkCard from '../../../components/AffLinkCard';
import StoreLayout from '../../../components/StoreLayout';
import StoreHero from '../../../components/StoreHero';
import useWindowSize from '../../../../hooks/useWindowSize';

export default function BrandPage() {
  const { slug } = useParams();
  const windowSize = useWindowSize();
  
  // State variables
  const [brand, setBrand] = useState(null);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch brand and affiliate links
  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      try {
        // Fetch the brand data first
        const brandsResponse = await getBrands(1, 100, 'name:asc', {
          slug: { $eq: slug }
        });
        
        if (brandsResponse.data && brandsResponse.data.length > 0) {
          // Set the brand data
          setBrand(brandsResponse.data[0]);
          
          // Now fetch affiliate links associated with this brand
          const affiliatesResponse = await getAffiliateLinks(1, 100, 'name:asc', {
            brand: { id: { $eq: brandsResponse.data[0].id } }
          });
          
          setAffiliateLinks(affiliatesResponse.data || []);
        } else {
          setError('Brand not found');
        }
      } catch (err) {
        console.error("Error fetching brand data:", err);
        setError('Failed to load brand information');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBrandData();
    }
  }, [slug]);

  // Transform affiliate data for AffLinkCard
  const transformAffiliateData = (affiliate) => {
    if (!affiliate) {
      return null;
    }
    
    // Handle image URL - check if it exists and ensure it's a full URL
    let imageUrl = null;
    if (affiliate.image && affiliate.image.url) {
      imageUrl = affiliate.image.url.startsWith('http') 
        ? affiliate.image.url 
        : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${affiliate.image.url}`;
    }
    
    return {
      id: affiliate.id,
      name: affiliate.name || 'Unnamed Affiliate',
      url: affiliate.url || '#',
      company: affiliate.company || '',
      slug: affiliate.slug || null,
      image: imageUrl,
      // Add brand information if it exists
      brand: affiliate.brand ? {
        id: affiliate.brand.id,
        name: affiliate.brand.name,
        slug: affiliate.brand.slug
      } : null
    };
  };
  
  // Get the number of columns based on window width
  const getColumnsCount = () => {
    const width = windowSize.width || 0;
    if (width >= 1200) return 4;
    if (width >= 992) return 3;
    if (width >= 576) return 2;
    return 1;
  };
  
  // Get card size based on window size and column count
  const getCardSize = () => {
    const width = windowSize.width || 0;
    const padding = 40; // Total horizontal padding
    const gap = 20; // Gap between cards
    const columns = getColumnsCount();
    
    // Calculate available width
    const availableWidth = Math.min(width - padding, 1200 - padding);
    
    // Calculate card width accounting for gaps between cards
    const cardWidth = Math.floor((availableWidth - (gap * (columns - 1))) / columns);
    
    return cardWidth;
  };

  // If loading, show loading state with hero
  if (loading) {
    return (
      <StoreLayout>
        {/* Include the store hero component */}
        <StoreHero />
        
        <div style={{ 
          maxWidth: '1200px',
          margin: '1.5rem auto',
          padding: '0 20px'
        }}>
          {/* Breadcrumb */}
          <div style={{
            marginBottom: '2rem',
            padding: '0.5rem 0'
          }}>
            <Link 
              href="/store" 
              style={{
                color: '#666',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Store
            </Link>
            <span style={{ margin: '0 0.5rem', color: '#666' }}>/</span>
            <span style={{ color: '#999', fontSize: '0.9rem' }}>Loading...</span>
          </div>
          
          {/* Loading indicators */}
          <div style={{
            marginBottom: '2rem',
            background: '#f5f5f5',
            height: '200px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            Loading brand information...
          </div>
        </div>
      </StoreLayout>
    );
  }

  // If error, show error state with hero
  if (error || !brand) {
    return (
      <StoreLayout>
        {/* Include the store hero component */}
        <StoreHero />
        
        <div style={{ 
          maxWidth: '1200px',
          margin: '1.5rem auto',
          padding: '0 20px'
        }}>
          {/* Breadcrumb */}
          <div style={{
            marginBottom: '2rem',
            padding: '0.5rem 0'
          }}>
            <Link 
              href="/store" 
              style={{
                color: '#666',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Store
            </Link>
            <span style={{ margin: '0 0.5rem', color: '#666' }}>/</span>
            <span style={{ color: '#999', fontSize: '0.9rem' }}>Brand not found</span>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '4rem 0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#444',
              marginBottom: '1.5rem',
              fontFamily: "'Bauhaus Soft Display', sans-serif",
            }}>
              {error || 'Brand not found'}
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '2rem'
            }}>
              We couldn't find the brand you're looking for.
            </p>
            <Link 
              href="/store" 
              style={{
                backgroundColor: '#E9887E',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              Return to Store
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      {/* Include the store hero component */}
      <StoreHero />
      
      <div style={{ 
        maxWidth: '1200px',
        margin: '1.5rem auto',
        padding: '0 20px'
      }}>
        {/* Breadcrumb */}
        <div style={{
          marginBottom: '2rem',
          padding: '0.5rem 0'
        }}>
          <Link 
            href="/store" 
            style={{
              color: '#666',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            Store
          </Link>
          <span style={{ margin: '0 0.5rem', color: '#666' }}>/</span>
          <span style={{ color: '#999', fontSize: '0.9rem' }}>{brand.name}</span>
        </div>
        
        {/* Brand Info Section */}
        <div style={{
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem'
        }}>
          {/* Brand Information */}
          <div style={{
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: windowSize.width < 768 ? '2rem' : '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#444',
              fontFamily: "'Bauhaus Soft Display', sans-serif"
            }}>
              {brand.name}
            </h1>
            
            {brand.description && (
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: '#555',
                marginBottom: '1.5rem'
              }}>
                {brand.description}
              </p>
            )}
            
            {brand.url && (
              <a 
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#E9887E',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'inline-block',
                  marginTop: '0.5rem'
                }}
              >
                Visit Official Website
              </a>
            )}
          </div>
        </div>
        
        {/* Products Heading */}
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: '#444',
          fontFamily: "'Bauhaus Soft Display', sans-serif",
        }}>
          {brand.name} Products
        </h2>
        
        {/* Products Grid */}
        {affiliateLinks.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${getColumnsCount()}, 1fr)`,
            gap: '20px',
            marginBottom: '3rem'
          }}>
            {affiliateLinks.map((affiliate) => {
              const transformedAffiliate = transformAffiliateData(affiliate);
              if (!transformedAffiliate) return null;
              
              const cardSize = getCardSize();
              
              return (
                <div key={affiliate.id} style={{
                  width: '100%',
                  height: cardSize,
                  maxHeight: cardSize
                }}>
                  <AffLinkCard affiliate={transformedAffiliate} />
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            marginBottom: '3rem'
          }}>
            <p style={{
              fontSize: '1.1rem',
              color: '#666'
            }}>
              No products available for this brand yet.
            </p>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}