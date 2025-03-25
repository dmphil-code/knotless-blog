"use client"

import { useState, useEffect } from 'react';
import AffLinkCard from '../components/AffLinkCard';
import StoreLayout from '../components/StoreLayout';
import useWindowSize from '../../hooks/useWindowSize';

// Sample product data - in production, this would come from an API or CMS
const sampleProducts = [
  {
    id: 1,
    title: "Silk Press Heat Protectant",
    link: "https://example.com/product1"
  },
  {
    id: 2,
    title: "Edge Control Gel",
    link: "https://example.com/product2"
  },
  {
    id: 3,
    title: "Detangling Brush",
    link: "https://example.com/product3"
  },
  {
    id: 4,
    title: "Moisture Retention Shampoo",
    link: "https://example.com/product4"
  },
  {
    id: 5,
    title: "Leave-in Conditioner",
    link: "https://example.com/product5"
  },
  {
    id: 6,
    title: "Scalp Treatment Oil",
    link: "https://example.com/product6"
  },
  {
    id: 7,
    title: "Wide Tooth Comb",
    link: "https://example.com/product7"
  },
  {
    id: 8,
    title: "Hair Growth Vitamins",
    link: "https://example.com/product8"
  },
  {
    id: 9,
    title: "Curl Defining Cream",
    link: "https://example.com/product9"
  }
];

// If you don't have product images yet, you can remove the image property
// or use placeholder images

export default function StorePage() {
  const windowSize = useWindowSize();
  const [products, setProducts] = useState(sampleProducts);
  // Since we've removed categories, we'll just use all products
  const filteredProducts = products;
  
  // No category handling needed
  
  return (
    <StoreLayout 
      title="Our Store" 
      description="Discover our favorite hair care products for all your styling needs"
    >
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem 3rem'
      }}>

        
        {/* Products Grid - 3x3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: windowSize.width < 600 
            ? 'repeat(2, 1fr)' 
            : 'repeat(3, 1fr)',
          gap: '30px',
          justifyItems: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {filteredProducts.map(product => (
            <AffLinkCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 0',
            color: '#666'
          }}>
            <p>No products found in this category.</p>
          </div>
        )}
        
        {/* Disclaimer */}
        <div style={{
          margin: '4rem 0 1rem',
          padding: '1.5rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center'
        }}>
          <p>
            <strong>Disclaimer:</strong> Some links on this page may be affiliate links. If you make a purchase through these links, we may earn a small commission at no extra cost to you.
          </p>
        </div>
      </div>
    </StoreLayout>
  );
}