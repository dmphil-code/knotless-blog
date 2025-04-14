"use client"

import { useState, useEffect } from 'react';
import { getAffiliateLinks, getBrands } from '../services/api';
import AffLinkCard from '../components/AffLinkCard';
import StoreLayout from '../components/StoreLayout';
import StoreHero from '../components/StoreHero';
import useWindowSize from '../../hooks/useWindowSize';
import Link from 'next/link';

export default function StorePage() {
  const windowSize = useWindowSize();
  
  // State for different data categories
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [brands, setBrands] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch featured products (affiliates where featured=true)
        const featuredResponse = await getAffiliateLinks(1, 100, 'name:asc', { featured: { $eq: true }});
        setFeaturedProducts(featuredResponse.data || []);
        
        // Fetch coupons (affiliates where type=Coupon)
        const couponsResponse = await getAffiliateLinks(1, 100, 'name:asc', { type: { $eq: 'Coupon' }});
        setCoupons(couponsResponse.data || []);
        
        // Fetch all brands
        const brandsResponse = await getBrands(1, 100, 'name:asc');
        setBrands(brandsResponse.data || []);
        
        // Fetch promotions (affiliates where promotion=true)
        const promotionsResponse = await getAffiliateLinks(1, 100, 'name:asc', { promotion: { $eq: true }});
        setPromotions(promotionsResponse.data || []);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform affiliate data for AffLinkCard
  const transformAffiliateData = (affiliate) => {
    if (!affiliate) {
      return null;
    }
    
    // Handle image URL - check if it exists and ensure it's a full URL
    let imageUrl = null;
    if (affiliate.image && affiliate.image.url) {
      imageUrl = affiliate.image.url;
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

  // Transform brand data for AffLinkCard
  const transformBrandData = (brand) => {
  if (!brand) {
    return null;
  }
  
  // Handle image URL - check if it exists and ensure it's a full URL
  let imageUrl = null;
  if (brand.image && brand.image.url) {
    imageUrl = brand.image.url;
  }
  
  return {
    id: brand.id,
    name: brand.name || 'Unnamed Brand',
    url: brand.url || '#',
    description: brand.description || '',
    slug: brand.slug || null,
    image: imageUrl
  };
};
  
  // Get card width based on window size
  const getCardWidth = () => {
    const width = windowSize.width || 0;
    if (width >= 1400) return 192; // 3/5 of 320
    if (width >= 992) return 180;  // 3/5 of 300
    if (width >= 768) return 168;  // 3/5 of 280
    if (width >= 576) return 144;  // 3/5 of 240
    return 132;                   // 3/5 of 220
  };

  // Render a section with title and scrollable row of cards
  const renderSection = (title, items, transformFunction) => {
    if (loading) {
      // Loading state
      return (
        <div className="store-section" style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#444',
            fontFamily: "'Bauhaus Soft Display', sans-serif",
            paddingLeft: '20px',
            textAlign: 'left'
          }}>{title}</h2>
          
          {/* Horizontal scrolling container */}
          <div style={{
            display: 'flex',
            flexDirection: 'row', // Ensure horizontal layout
            overflowX: 'auto',
            overflowY: 'hidden', // Prevent vertical scrolling
            scrollbarWidth: 'thin',
            scrollbarColor: '#E9887E #f1f1f1',
            padding: '10px 20px 20px',
            WebkitOverflowScrolling: 'touch',
            gap: '20px',
            width: '100%'
          }}>
            {/* Loading placeholders */}
            {Array(6).fill().map((_, i) => (
              <div key={i} style={{
                minWidth: `${getCardWidth()}px`,
                width: `${getCardWidth()}px`,
                height: `${getCardWidth()}px`,
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                flexShrink: 0
              }}></div>
            ))}
          </div>
        </div>
      );
    }
    
    // Skip empty sections
    if (!items || items.length === 0) {
      return null;
    }
    
    return (
      <div className="store-section" style={{ marginBottom: '50px' }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: '#444',
          fontFamily: "'Bauhaus Soft Display', sans-serif",
          paddingLeft: '20px',
          textAlign: 'left'
        }}>{title}</h2>
        
        {/* Scrollable row container - explicitly set to row layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'row', // Explicitly set row layout
          flexWrap: 'nowrap', // Prevent wrapping
          overflowX: 'auto',
          overflowY: 'hidden', // Prevent vertical scrolling
          scrollbarWidth: 'thin',
          scrollbarColor: '#E9887E #f1f1f1',
          padding: '10px 20px 20px',
          WebkitOverflowScrolling: 'touch',
          gap: '20px',
          width: '100%',
          alignItems: 'stretch' // Ensure consistent height
        }}>
          {items.map((item) => {
            const transformedItem = transformFunction(item);
            if (!transformedItem) return null;
            
            const cardSize = getCardWidth();
            
            return (
              <div key={item.id} style={{
                minWidth: `${cardSize}px`,
                width: `${cardSize}px`,
                height: `${cardSize}px`,
                flexShrink: 0,
                display: 'inline-block' // Ensure block display
              }}>
                <AffLinkCard 
                  affiliate={transformedItem} 
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  
  return (
    <StoreLayout>
      {/* Hero Section */}
      <StoreHero />
      
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 0 3rem'
      }}>
        {/* Featured Products Section */}
        {renderSection('Featured Products', featuredProducts, transformAffiliateData)}
        
        {/* Coupons Section */}
        {renderSection('Coupons', coupons, transformAffiliateData)}
        
        {/* Brands Section */}
        <div className="store-section" style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#444',
            fontFamily: "'Bauhaus Soft Display', sans-serif",
            paddingLeft: '20px',
            textAlign: 'left'
          }}>Brands</h2>
          
          {/* Brands horizontal scroll container */}
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'thin',
              scrollbarColor: '#E9887E #f1f1f1',
              padding: '10px 20px 20px',
              WebkitOverflowScrolling: 'touch',
              gap: '20px',
              width: '100%'
            }}>
              {/* Loading placeholders */}
              {Array(6).fill().map((_, i) => (
                <div key={i} style={{
                  minWidth: `${getCardWidth()}px`,
                  width: `${getCardWidth()}px`,
                  height: `${getCardWidth()}px`,
                  backgroundColor: '#f5f5f5',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  flexShrink: 0
                }}></div>
              ))}
            </div>
          ) : brands.length === 0 ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666'
            }}>
              No brands available
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'thin',
              scrollbarColor: '#E9887E #f1f1f1',
              padding: '10px 20px 20px',
              WebkitOverflowScrolling: 'touch',
              gap: '20px',
              width: '100%',
              alignItems: 'stretch'
            }}>
              {brands.map((brand) => {
                const transformedBrand = transformBrandData(brand);
                if (!transformedBrand) return null;
                
                const cardSize = getCardWidth();
                
                return (
                  <div
                    key={brand.id}
                    onClick={() => window.location.href = `/store/brand/${brand.slug || brand.id}`}
                    style={{
                      minWidth: `${cardSize}px`,
                      width: `${cardSize}px`,
                      height: `${cardSize}px`,
                      flexShrink: 0,
                      display: 'inline-block'
                    }}
                  >
                    <AffLinkCard 
                      affiliate={transformedBrand}
                      isWrappedInLink={true}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Sales & Promotions Section */}
        {renderSection('Sales & Promotions', promotions, transformAffiliateData)}
        
        {/* Display "No content" message if all sections are empty and not loading */}
        {!loading && 
         featuredProducts.length === 0 && 
         coupons.length === 0 && 
         brands.length === 0 && 
         promotions.length === 0 && (
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
              No affiliate links or brands available at the moment.
            </p>
            <p style={{
              fontSize: '1rem',
              color: '#888'
            }}>
              Please check back later for recommendations.
            </p>
          </div>
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
      
      {/* Custom scrollbar styling for webkit browsers */}
      <style jsx global>{`
        /* Webkit scrollbar styling */
        .store-section div::-webkit-scrollbar {
          height: 6px;
        }
        
        .store-section div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .store-section div::-webkit-scrollbar-thumb {
          background: #E9887E;
          border-radius: 10px;
        }
        
        .store-section div::-webkit-scrollbar-thumb:hover {
          background: #d47068;
        }
      `}</style>
    </StoreLayout>
  );
}