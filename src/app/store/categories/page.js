"use client"

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAffiliateLinks, getBrands } from '../../services/api';
import AffLinkCard from '../../components/AffLinkCard';
import StoreLayout from '../../components/StoreLayout';
import useWindowSize from '../../../hooks/useWindowSize';

// Define categories with their display names and query parameters
const categories = [
  { id: 1, title: "Coupons", slug: "coupons", queryType: "type", queryValue: "Coupon" },
  { id: 2, title: "Brands", slug: "brands", queryType: "brands", queryValue: "all" },
  { id: 3, title: "Sales & Promotions", slug: "sales-promotions", queryType: "promotion", queryValue: "true" },
  { id: 4, title: "Hair Care", slug: "hair-care", queryType: "categories", queryValue: "Hair Care" },
  { id: 5, title: "Skin Care", slug: "skin-care", queryType: "categories", queryValue: "Skin Care" },
  { id: 6, title: "Beauty", slug: "beauty", queryType: "categories", queryValue: "Beauty" }
];

// Loading fallback component
function LoadingPlaceholder() {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      color: '#666'
    }}>
      <p>Loading category data...</p>
    </div>
  );
}

// Main component content separated from search params logic
function CategoryContent() {
  const windowSize = useWindowSize();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'brands'; // Default to brands if no category is specified
  
  // State variables
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBreadcrumb, setCurrentBreadcrumb] = useState('Categories');

  // Find the selected category object based on the active category
  const selectedCategory = categories.find(cat => 
    cat.slug === activeCategory || cat.title.toLowerCase() === activeCategory
  ) || categories[1]; // Default to Brands

  // Set page title based on the selected category
  useEffect(() => {
    setCurrentBreadcrumb(selectedCategory.title);
  }, [selectedCategory]);

  // Fetch data based on the selected category
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        if (selectedCategory.queryType === 'brands') {
          // Fetch all brands
          const brandsResponse = await getBrands(1, 100, 'name:asc');
          setItems(brandsResponse.data || []);
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
          
          const response = await getAffiliateLinks(1, 100, 'name:asc', filterObject);
          setItems(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [selectedCategory]);

  // Handle category selection
  const handleCategoryClick = (category) => {
    setActiveCategory(category.slug);
  };

  // Transform affiliate data for AffLinkCard
  const transformAffiliateData = (affiliate) => {
    if (!affiliate) return null;
    
    // Handle image URL
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

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px',
      paddingTop: '40px' // Space after the header
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
        <span style={{ color: '#999', fontSize: '0.9rem' }}>{currentBreadcrumb}</span>
      </div>
      
      {/* Main content with two columns */}
      <div style={{
        display: 'flex',
        flexDirection: windowSize.width < 768 ? 'column' : 'row',
        gap: '30px'
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
            {categories.map(category => (
              <li key={category.id} style={{
                marginBottom: '0.75rem'
              }}>
                <a 
                  href={`/store/categories?category=${category.slug}`}
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
          
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 
                windowSize.width < 576 ? '1fr' : 
                windowSize.width < 992 ? 'repeat(2, 1fr)' : 
                'repeat(3, 1fr)',
              gap: '20px'
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
          ) : items.length === 0 ? (
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
              gap: '20px'
            }}>
              {items.map(item => {
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
  );
}

// Main page component with suspense boundary
export default function CategoriesPage() {
  return (
    <StoreLayout>
      <Suspense fallback={<LoadingPlaceholder />}>
        <CategoryContent />
      </Suspense>
    </StoreLayout>
  );
}