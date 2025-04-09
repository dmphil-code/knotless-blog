// Updated src/app/components/AffLinkCard.js
import React from 'react';
import Link from 'next/link';

const AffLinkCard = ({ affiliate, isWrappedInLink = false, onClick = null }) => {
  // Extract properties from affiliate object
  const { 
    name,
    url,
    company,
    brand,
    image
  } = affiliate;

  // Determine if we have a valid image
  const hasImage = Boolean(image);

  // Create the card content
  const cardContent = (
    <>
      {/* Background image - if available */}
      {hasImage && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden',
          borderRadius: '12px'
        }}>
          <img 
            src={image} 
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Dark overlay for better text visibility */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 2
          }}></div>
        </div>
      )}
      
      {/* Content container - with higher z-index than the image */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        width: '100%',
        height: '100%',
      }}>
        {/* Name */}
        <h3 style={{ 
          fontSize: '1.25rem',
          fontWeight: '600',
          textAlign: 'center',
          color: hasImage ? 'white' : '#773800',
          margin: '0 0 8px 0',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          textShadow: hasImage ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
        }}>
          {name}
        </h3>
        
        {/* Company (if it exists) */}
        {company && (
          <p style={{ 
            fontSize: '0.9rem',
            fontWeight: '400',
            textAlign: 'center',
            color: hasImage ? 'rgba(255,255,255,0.9)' : '#9A6434',
            margin: '0 0 8px 0',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textShadow: hasImage ? '0 1px 1px rgba(0,0,0,0.5)' : 'none'
          }}>
            {company}
          </p>
        )}
        
        {/* Brand button (if it exists) */}
        {brand && brand.name && (
          <div style={{
            backgroundColor: hasImage ? 'rgba(255, 255, 255, 0.85)' : '#F4B637',
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
        
        {/* Visit/View button */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          backgroundColor: hasImage ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.8)',
          color: '#E9887E',
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: '500',
          padding: '4px 12px',
          borderRadius: '12px',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }} className="visit-link">
          {isWrappedInLink ? 'View' : 'Visit'}
        </div>
      </div>
    </>
  );

  return (
    <div 
      style={{
        width: '100%',       
        height: '100%',      
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: hasImage ? 'transparent' : '#FFE8C9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }} 
      className={hasImage ? "aff-link-card-with-image" : "aff-link-card"}
      onClick={onClick}
    >
      {/* If this component is already wrapped in a Link component, don't use another Link */}
      {isWrappedInLink ? (
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}>
          {cardContent}
        </div>
      ) : (
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
          {cardContent}
        </Link>
      )}

      <style jsx>{`
        .aff-link-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          background-color: #E9887E;
        }
        
        .aff-link-card-with-image:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }
        
        .aff-link-card:hover h3,
        .aff-link-card:hover p {
          color: white;
        }
        
        .aff-link-card:hover .visit-link,
        .aff-link-card-with-image:hover .visit-link {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default AffLinkCard;