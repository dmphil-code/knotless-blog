"use client"

import { useState, useEffect, useRef } from 'react';
import { getAffiliateLinks, getBrands } from '../services/api';
import AffLinkCard from '../components/AffLinkCard';
import StoreLayout from '../components/StoreLayout';
import useWindowSize from '../../hooks/useWindowSize';
import Link from 'next/link';

// Featured Brand Cards Component
const FeaturedBrandCards = () => {
  const [featuredBrands, setFeaturedBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const windowSize = useWindowSize();

  useEffect(() => {
    const fetchFeaturedBrands = async () => {
      setLoading(true);
      try {
        // Fetch brands where featured field is true
        const brandsResponse = await getBrands(1, 6, 'name:asc', { featured: { $eq: true } });
        setFeaturedBrands(brandsResponse.data || []);
      } catch (error) {
        console.error("Error fetching featured brands:", error);
        setFeaturedBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBrands();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap',
        maxWidth: '90%'
      }}>
        {Array(4).fill().map((_, i) => (
          <div key={i} style={{
            width: '140px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}></div>
        ))}
      </div>
    );
  }

  if (featuredBrands.length === 0) {
    return null; // Don't show anything if no featured brands
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      flexWrap: 'wrap',
      maxWidth: '90%'
    }}>
      {featuredBrands.map(brand => (
        <Link 
          key={brand.id}
          href={`/store/brand/${brand.slug || brand.id}`}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderRadius: '8px',
            padding: '10px 20px',
            textDecoration: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '180px',
            height: '140px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          className="featured-brand-card"
        >
          <span style={{
            color: '#333',
            fontFamily: 'Inter, sans-serif',
            fontSize: windowSize.width < 768 ? '1rem' : '1.25rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            {brand.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

// Define categories for side menu (includes Beauty)
const sideMenuCategories = [
  { id: 1, title: "Coupons", slug: "coupons", queryType: "type", queryValue: "Coupon" },
  { id: 2, title: "Brands", slug: "brands", queryType: "brands", queryValue: "all" },
  { id: 3, title: "Sales & Promotions", slug: "sales-promotions", queryType: "promotion", queryValue: "true" },
  { id: 4, title: "Hair Care", slug: "hair-care", queryType: "categories", queryValue: "Hair Care" },
  { id: 5, title: "Skin Care", slug: "skin-care", queryType: "categories", queryValue: "Skin Care" },
  { id: 6, title: "Beauty", slug: "beauty", queryType: "categories", queryValue: "Beauty" }
];

// Define categories for cards (without Sales & Promotions, with Beauty instead)
const shopCategories = [
  { id: 1, title: "Coupons", slug: "coupons", queryType: "type", queryValue: "Coupon" },
  { id: 2, title: "Brands", slug: "brands", queryType: "brands", queryValue: "all" },
  { id: 3, title: "Beauty", slug: "beauty", queryType: "categories", queryValue: "Beauty" },
  { id: 4, title: "Hair Care", slug: "hair-care", queryType: "categories", queryValue: "Hair Care" },
  { id: 5, title: "Skin Care", slug: "skin-care", queryType: "categories", queryValue: "Skin Care" }
];

export default function StorePage() {
  const windowSize = useWindowSize();
  
  // State for featured products
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for category display
  const [activeCategory, setActiveCategory] = useState('brands'); // Default to brands
  const [categoryItems, setCategoryItems] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  
  // Ref for category section scrolling
  const categorySectionRef = useRef(null);

  // Find the selected category object based on the active category
  const selectedCategory = sideMenuCategories.find(cat => 
    cat.slug === activeCategory || cat.title.toLowerCase() === activeCategory
  ) || sideMenuCategories[1]; // Default to Brands

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

  // Fetch data based on the selected category
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoadingCategory(true);
      try {
        if (selectedCategory.queryType === 'brands') {
          // Fetch all brands
          const brandsResponse = await getBrands(1, 12, 'name:asc'); // Limit to 12 items for homepage
          setCategoryItems(brandsResponse.data || []);
        } else {
          // Fetch affiliates based on the category filter
          const filterKey = selectedCategory.queryType;
          const filterValue = selectedCategory.queryValue;
          
          const filterObject = {};
          if (filterKey === 'categories') {
            // Handle relational filtering for categories
            filterObject['categories'] = {
              name: {
                $eq: filterValue
              }
            };
          } else if (filterKey === 'type') {
            filterObject[filterKey] = { $eq: filterValue };
          } else if (filterKey === 'promotion') {
            filterObject[filterKey] = { $eq: true };
          }
          
          const response = await getAffiliateLinks(1, 12, 'name:asc', filterObject); // Limit to 12 items
          setCategoryItems(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        setCategoryItems([]);
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategoryData();
  }, [selectedCategory]);

  // Handle category selection
  const handleCategoryClick = (category) => {
    setActiveCategory(category.slug);
    
    // Scroll to the category section with offset for better viewing
    if (categorySectionRef.current) {
      // Get the element's position
      const yOffset = -120; // Negative offset to position higher on the page
      const element = categorySectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

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

  // Transform brand data for AffLinkCard
  const transformBrandData = (brand) => {
    if (!brand) return null;
    
    // Handle image URL
    let imageUrl = null;
    if (brand.image && brand.image.url) {
      imageUrl = brand.image.url;
    }
    
    return {
      id: brand.id,
      name: brand.name || 'Unnamed Brand',
      url: `/store/brand/${brand.slug || brand.id}`, // Link to the brand page
      company: brand.description || '',
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

  return (
    <StoreLayout>
      {/* Hero Section with darker and thicker outline for text */}
      <div className="store-hero-container" style={{
        position: 'relative',
        backgroundColor: '#222',
        backgroundImage: 'url("/images/store_hero.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '2px solid #E9887E',
        width: '100%',
        height: windowSize.width < 768 ? '260px' : '350px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: '40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 0 20px',
        }}>
          <h1 style={{ 
            fontSize: windowSize.width < 768 ? '2.5rem' : '5.5rem',
            fontWeight: '800', // Increased from 700 to 800 for thicker text
            color: '#E9887E',
            // textShadow: `
            //   -3px -3px 0 #773800,  
            //   3px -3px 0 #773800,
            //   -3px 3px 0 #773800,
            //   3px 3px 0 #773800,
            //   0px 3px 0 #773800,
            //   3px 0px 0 #773800,
            //   0px -3px 0 #773800,
            //   -3px 0px 0 #773800 `, // Thicker and darker outline using multiple shadows with the dark brown from brand guide
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
        {/* Category Cards Section - without title */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 
            windowSize.width < 576 ? '1fr' : 
            windowSize.width < 768 ? 'repeat(2, 1fr)' : 
            windowSize.width < 992 ? 'repeat(3, 1fr)' : 
            windowSize.width < 1200 ? 'repeat(4, 1fr)' : 
            'repeat(5, 1fr)', // Showing all 5 cards in a row on large screens
          gap: '20px',
          padding: '0 20px',
          marginBottom: '3rem'
        }}>
          {shopCategories.map(category => {
            // Determine the correct image path based on category
            let imagePath = '';
            switch(category.slug) {
              case 'coupons':
                imagePath = '/images/CategoryCard_Coupons.jpg';
                break;
              case 'brands':
                imagePath = '/images/CategoryCard_Brands.jpg';
                break;
              case 'beauty':
                imagePath = '/images/CategoryCard_Beauty.jpg';
                break;
              case 'hair-care':
                imagePath = '/images/CategoryCard_Haircare.jpg';
                break;
              case 'skin-care':
                imagePath = '/images/CategoryCard_Skincare.jpg';
                break;
              default:
                imagePath = '/images/bump_salmon.png'; // Default fallback
            }
            
            return (
              <div key={category.id} style={{ textAlign: 'center' }}>
                {/* Image Card - No overlay, clean design */}
                <div style={{
                  position: 'relative',
                  height: '180px',
                  width: '100%',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => {
                  // Find corresponding category in sideMenuCategories
                  const menuCategory = sideMenuCategories.find(cat => cat.slug === category.slug);
                  if (menuCategory) {
                    handleCategoryClick(menuCategory);
                  }
                }}>
                  <img 
                    src={imagePath}
                    alt={category.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                
                {/* Category title below image */}
                <h3 
                  onClick={() => {
                    // Same click handler as the image
                    const menuCategory = sideMenuCategories.find(cat => cat.slug === category.slug);
                    if (menuCategory) {
                      handleCategoryClick(menuCategory);
                    }
                  }}
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: '0',
                    color: '#444',
                    cursor: 'pointer',
                    fontFamily: "'Bauhaus Soft Display', sans-serif"
                  }}
                >
                  {category.title}
                </h3>
              </div>
            );
          })}
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
        
        {/* Featured Brands Banner - NEW SECTION */}
        <div className="store-section" style={{ marginBottom: '50px', padding: '0 20px' }}>
          <div className="relative w-full my-8" style={{ position: 'relative', width: '100%', margin: '2rem 0' }}>
            <img 
              src="/images/FeaturedBrands_Banner.png" 
              alt="Featured Brands with Beauty Products" 
              style={{ 
                width: '100%', 
                height: 'auto',
                borderRadius: '8px'
              }}
            />
            <div style={{ 
              position: 'absolute', 
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: '30px'  // Add top padding for text
            }}>
              <h2 style={{ 
                color: 'white',
                fontFamily: 'Bauhaus, sans-serif',
                fontSize: windowSize.width < 768 ? '1.5rem' : windowSize.width < 992 ? '3rem' : '3.5rem',
                fontWeight: 'bold',
                WebkitTextStroke: '2px #E9887E',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                padding: '0 1rem',
                textAlign: 'center',
                marginBottom: '30px'
              }}>
                Get up to 50% off top brands!
              </h2>
              
              {/* Featured Brand Cards */}
              <FeaturedBrandCards />
            </div>
          </div>
        </div>
        
        {/* Category Content Display Section (New) - Formatted like categories page */}
      <div className="store-section" style={{ marginBottom: '50px' }} ref={categorySectionRef} id="brands">
          {/* Main content with two columns */}
          <div style={{
            display: 'flex',
            flexDirection: windowSize.width < 768 ? 'column' : 'row',
            gap: '30px',
            padding: '0 20px'
          }}>
            {/* Left column - Categories list */}
            <div style={{
              width: windowSize.width < 768 ? '100%' : '250px',
              flexShrink: 0
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#444',
                fontFamily: "'Bauhaus Soft Display', sans-serif",
              }}>
                Categories
              </h3>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {sideMenuCategories.map(category => (
                  <li key={category.id} style={{
                    marginBottom: '0.75rem'
                  }}>
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category);
                      }}
                      style={{
                        textDecoration: 'none',
                        color: category.slug === activeCategory ? '#E9887E' : '#444',
                        fontWeight: category.slug === activeCategory ? '600' : '400',
                        fontSize: '1rem',
                        display: 'block',
                        padding: '0.5rem 0',
                        borderLeft: category.slug === activeCategory ? '3px solid #E9887E' : '3px solid transparent',
                        paddingLeft: '10px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {category.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right column - Items grid */}
            <div style={{
              flex: 1
            }}>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: '#444',
                fontFamily: "'Bauhaus Soft Display', sans-serif",
              }}>
                {selectedCategory.title}
              </h2>
              
              {loadingCategory ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 
                    windowSize.width < 576 ? '1fr' : 
                    windowSize.width < 992 ? 'repeat(2, 1fr)' : 
                    'repeat(3, 1fr)',
                  gap: '20px',
                  height: '450px', // Fixed height for scrollable area
                  overflowY: 'auto', // Make it scrollable
                  paddingRight: '10px' // Space for scrollbar
                }}>
                  {/* Loading placeholders */}
                  {Array(6).fill().map((_, i) => (
                    <div key={i} style={{
                      height: '200px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}></div>
                  ))}
                </div>
              ) : categoryItems.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '12px',
                  color: '#666'
                }}>
                  <p>No items found in this category.</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 
                    windowSize.width < 576 ? '1fr' : 
                    windowSize.width < 992 ? 'repeat(2, 1fr)' : 
                    'repeat(3, 1fr)',
                  gap: '20px',
                  height: '450px', // Fixed height for scrollable area
                  overflowY: 'auto', // Make it scrollable
                  paddingRight: '10px', // Space for scrollbar
                  // Custom scrollbar styling
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#E9887E #f1f1f1'
                }}>
                  {categoryItems.map(item => {
                    // Transform data based on category type
                    const transformedItem = selectedCategory.queryType === 'brands'
                      ? transformBrandData(item)
                      : transformAffiliateData(item);
                      
                    if (!transformedItem) return null;
                    
                    return (
                      <div key={item.id} style={{
                        height: '200px'
                      }}>
                        <AffLinkCard 
                          affiliate={transformedItem} 
                          isWrappedInLink={selectedCategory.queryType === 'brands'}
                          onClick={selectedCategory.queryType === 'brands' ? 
                            () => window.location.href = `/store/brand/${item.slug || item.id}` : null}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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
          width: 6px;
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
        div[style*="cursor: pointer"]:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        
        h3[style*="cursor: pointer"]:hover {
          color: #E9887E;
        }
        
        /* Add hover effects to the featured brand cards */
        .featured-brand-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          background-color: white !important;
        }
        }
      `}</style>
    </StoreLayout>
  );
}