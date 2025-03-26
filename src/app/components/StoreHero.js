// src/app/components/StoreHero.js
import React from 'react';
import useWindowSize from '../../hooks/useWindowSize';

const StoreHero = ({ title, description }) => {
  const windowSize = useWindowSize();
  
  return (
    <div className="store-hero-container" style={{
      position: 'relative',
      backgroundColor: '#222',
      backgroundImage: 'url("/images/hero-background2.png")', // Different reference from main hero
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'soft-light',
      color: 'white',
      width: '100%',
      padding: '100px 2rem 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: '40px'
    }}>
      {/* Title */}
      <h1 style={{ 
        fontSize: windowSize.width < 768 ? '2.5rem' : '3.5rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        maxWidth: '800px',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
      }}>
        {title || 'Our Affiliates'}
      </h1>
      
      {/* Description */}
      {description && (
        <p style={{
          fontSize: windowSize.width < 768 ? '1.1rem' : '1.3rem',
          fontWeight: '400',
          maxWidth: '700px',
          opacity: '0.9',
          lineHeight: '1.6',
          marginBottom: '1rem',
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'
        }}>
          {description}
        </p>
      )}
      
      {/* Optional decorative element */}
      <div style={{
        width: '80px',
        height: '4px',
        backgroundColor: '#E9887E',
        margin: '25px auto 0'
      }}></div>
    </div>
  );
};

export default StoreHero;