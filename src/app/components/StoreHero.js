// src/app/components/StoreHero.js
import React from 'react';
import useWindowSize from '../../hooks/useWindowSize';

const StoreHero = () => {
  const windowSize = useWindowSize();
  
  return (
    <div className="store-hero-container" style={{
      position: 'relative',
      backgroundColor: '#222',
      backgroundImage: 'url("/images/store_hero5.jpg")', // New image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%',
      height: windowSize.width < 768 ? '260px' : '350px', // Fixed height for better control
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end', // Position content at bottom
      marginBottom: '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 20px 40px', // Added bottom padding to move text up from very bottom
      }}>
        {/* Title - aligned with content sections */}
        <h1 style={{ 
          fontSize: windowSize.width < 768 ? '2.5rem' : '4rem',
          fontWeight: '700',
          color: 'white',
          textShadow: '-1px -1px 0 #E9887E, 1px -1px 0 #E9887E, -1px 1px 0 #E9887E, 1px 1px 0 #E9887E', // Salmon outline
          fontFamily: "'Bauhaus Soft Display', sans-serif", // Bauhaus font
          margin: 0, // Remove default margin
          lineHeight: 1.2
        }}>
          Knotless Store
        </h1>
      </div>
    </div>
  );
};

export default StoreHero;