// Updated src/app/components/AffLinkCard.js
import React from 'react';
import Link from 'next/link';

const AffLinkCard = ({ affiliate }) => {
  // Extract properties from affiliate object
  const { 
    name,
    url,
    company,
    brand
  } = affiliate;

  return (
    <div style={{
      width: '100%',       
      height: '100%',      
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#FFE8C9',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '15px',
      position: 'relative',
      overflow: 'hidden',
    }} className="aff-link-card">
      <Link 
        href={url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Name */}
        <h3 style={{ 
          fontSize: '1.25rem',
          fontWeight: '600',
          textAlign: 'center',
          color: '#773800',
          margin: '0 0 8px 0',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {name}
        </h3>
        
        {/* Company (if it exists) */}
        {company && (
          <p style={{ 
            fontSize: '0.9rem',
            fontWeight: '400',
            textAlign: 'center',
            color: '#9A6434',
            margin: '0 0 8px 0',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {company}
          </p>
        )}
        
        {/* Brand button (if it exists) */}
        {brand && brand.name && (
          <div style={{
            backgroundColor: '#F4B637',
            color: '#773800',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '500',
            margin: '5px 0',
          }}>
            {brand.name}
          </div>
        )}
        
        {/* Visit link - always visible */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          backgroundColor: 'rgba(255,255,255,0.8)',
          color: '#E9887E',
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: '500',
          padding: '4px 12px',
          borderRadius: '12px',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }} className="visit-link">
          Visit
        </div>
      </Link>

      <style jsx>{`
        .aff-link-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          background-color: #E9887E;
        }
        
        .aff-link-card:hover h3,
        .aff-link-card:hover p {
          color: white;
        }
        
        .aff-link-card:hover .visit-link {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default AffLinkCard;