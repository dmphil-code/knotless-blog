"use client"

import { useState, useEffect } from 'react';
import { getAffiliateLinks } from '../services/api';
import AffLinkCard from '../components/AffLinkCard';
import StoreLayout from '../components/StoreLayout';
import useWindowSize from '../../hooks/useWindowSize';
import Link from 'next/link';

// Define categories outside the component to avoid redeclaration
const shopCategories = [
  { id: 1, title: "Coupons", description: "Exclusive deals and discounts for your favorite products" },
  { id: 2, title: "Brands", description: "Shop by your favorite beauty and hair care brands" },
  { id: 3, title: "Hair Care", description: "Products for all hair types and styling needs" },
  { id: 4, title: "Skin Care", description: "Nourish and enhance your skin's natural beauty" },
  { id: 5, title: "Beauty", description: "Makeup and accessories for your beauty routine" }
];

export default function StorePage() {
  const windowSize = useWindowSize();
  
  // State for featured products
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch featured products (affiliates where featured=true)
        const featuredResponse = await getAffiliateLinks(1, 100, 'name:asc', { featured: { $eq: true }});
        setFeaturedProducts(featuredResponse.data || []);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to transform affiliate data
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
  
  // Get card width based on window size
  const getCardWidth = () => {
    const width = windowSize.width || 0;
    if (width >= 1400) return 192; // 3/5 of 320
    if (width >= 992) return 180;  // 3/5 of 300
    if (width >= 768) return 168;  // 3/5 of 280
    if (width >= 576) return 144;  // 3/5 of 240
    return 132;                   // 3/5 of 220
  };

  return (
    <StoreLayout>
      {/* Hero Section with darker and thicker outline for text */}
      <div className="store-hero-container" style={{
        position: 'relative',
        backgroundColor: '#222',
        backgroundImage: 'url("/images/store_hero4.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: windowSize.width < 768 ? '260px' : '350px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginBottom: '40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '0 20px 40px',
        }}>
          <h1 style={{ 
            fontSize: windowSize.width < 768 ? '2.5rem' : '4rem',
            fontWeight: '800', // Increased from 700 to 800 for thicker text
            color: 'white',
            textShadow: `
              -3px -3px 0 #773800,  
              3px -3px 0 #773800,
              -3px 3px 0 #773800,
              3px 3px 0 #773800,
              0px 3px 0 #773800,
              3px 0px 0 #773800,
              0px -3px 0 #773800,
              -3px 0px 0 #773800
            `, // Thicker and darker outline using multiple shadows with the dark brown from brand guide
            fontFamily: "'Bauhaus Soft Display', sans-serif",
            margin: 0,
            lineHeight: 1.2
          }}>
            Knotless Store
          </h1>
        </div>
      </div>
      
      <div style={{ 
        maxWidth: '1400px', // Increased from 1200px to accommodate 5 cards
        margin: '0 auto',
        padding: '20px 0 3rem'
      }}>
        {/* Category Cards Section using HeroArticleCard design */}
        <div className="store-section" style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#444',
            fontFamily: "'Bauhaus Soft Display', sans-serif",
            paddingLeft: '20px',
            textAlign: 'left'
          }}>Shop By Category</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 
              windowSize.width < 576 ? '1fr' : 
              windowSize.width < 768 ? 'repeat(2, 1fr)' : 
              windowSize.width < 992 ? 'repeat(3, 1fr)' : 
              windowSize.width < 1200 ? 'repeat(4, 1fr)' : 
              'repeat(5, 1fr)', // Showing all 5 cards in a row on large screens
            gap: '20px',
            padding: '0 20px'
          }}>
            {shopCategories.map(category => (
              <div key={category.id} className="hero-article-card" style={{
                position: 'relative',
                height: '180px', // Reduced height to better fit 5 in a row
                width: '100%',
                overflow: 'visible',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                borderRadius: '12px',
                marginBottom: '20px',
                backgroundColor: '#E9887E', // Salmon background color from brand guide
                cursor: 'pointer',
                border: '1px solid white' // White border like HeroArticleCard
              }}>
                {/* Content container */}
                <div style={{
                  position: 'relative',
                  zIndex: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  height: '100%',
                  width: '100%',
                }}>
                  <h3 className="hero-article-title" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    zIndex: 2,
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    lineHeight: '1.3',
                    margin: 0,
                    padding: '10px',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}>
                    {category.title}
                  </h3>
                  
                  <div className="hero-read-more" style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#E9887E',
                    color: 'white',
                    padding: '12px 25px',
                    zIndex: 10,
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    borderRadius: '20px', // Added rounded edges to the bottom button
                  }}>
                    SHOP {/* Changed back to "SHOP" as requested */}
                  </div>
                </div>
                
                {/* Dark overlay for better text visibility */}
                <div className="hero-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%)',
                  zIndex: 1,
                  borderRadius: '12px'
                }}></div>
                
                {/* Removed description text as requested */}
                
                {/* Clickable link overlay - now linking to the categories page */}
                <Link href={`/store/categories?category=${category.title.toLowerCase()}`} style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 4,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  borderRadius: '12px'
                }} aria-label={`Shop ${category.title}`}>
                  <span style={{ display: 'none' }}>Shop {category.title}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        {/* Featured Products Section - Only kept this row as requested */}
        <div className="store-section" style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#444',
            fontFamily: "'Bauhaus Soft Display', sans-serif",
            paddingLeft: '20px',
            textAlign: 'left'
          }}>Featured Products</h2>
          
          {/* Horizontal scrolling container */}
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
          ) : featuredProducts.length === 0 ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666'
            }}>
              No featured products available
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
              {featuredProducts.map((product) => {
                const transformedProduct = transformAffiliateData(product);
                if (!transformedProduct) return null;
                
                const cardSize = getCardWidth();
                
                return (
                  <div key={product.id} style={{
                    minWidth: `${cardSize}px`,
                    width: `${cardSize}px`,
                    height: `${cardSize}px`,
                    flexShrink: 0,
                    display: 'inline-block'
                  }}>
                    <AffLinkCard 
                      affiliate={transformedProduct} 
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Disclaimer - kept from original */}
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
        
        /* Add hover effects to the category cards */
        .hero-article-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hero-article-card:hover .hero-read-more {
          background-color: #d47068;
        }
      `}</style>
    </StoreLayout>
  );
}