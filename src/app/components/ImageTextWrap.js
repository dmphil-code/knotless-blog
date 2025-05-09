"use client";

import React, { useEffect, useState } from 'react';

function ImageTextWrap({ 
  image, 
  alt = "Article image",
  imageWidth = "40%", 
  imageMargin = "0 20px 10px 0",
  children 
}) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check window width on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener("resize", checkMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // For mobile view, use a different layout (stacked instead of wrapped)
  if (isMobile) {
    return (
      <div className="blog-content-wrap-mobile" style={{ position: 'relative' }}>
        {/* Image container with mask for mobile */}
        <div style={{ 
          marginBottom: '20px',
          width: '100%',
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* The mask image as a CSS mask */}
          <div style={{
            width: '100%',
            position: 'relative',
            WebkitMaskImage: 'url(/images/image_mask2.png)',
            maskImage: 'url(/images/image_mask2.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            overflow: 'hidden'
          }}>
            {image && (
              <img 
                src={image} 
                alt={alt || ""}
                style={{
                  width: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  maxHeight: '450px'
                }}
              />
            )}
          </div>
        </div>
        
        {/* Content below image */}
        <div>{children}</div>
      </div>
    );
  }
  
  // For desktop view, use the floating layout with mask
  return (
    <div className="blog-content-wrap-desktop" style={{ position: 'relative' }}>
      {/* Floating image container with mask */}
      <div style={{
        float: 'left',
        width: imageWidth,
        margin: imageMargin,
        position: 'relative'
      }}>
        {/* The mask image as a CSS mask */}
        <div style={{
          width: '100%',
          position: 'relative',
          WebkitMaskImage: 'url(/images/image_mask2.png)',
          maskImage: 'url(/images/image_mask2.png)',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          overflow: 'hidden'
        }}>
          {image && (
            <img 
              src={image} 
              alt={alt || ""}
              style={{
                width: '100%',
                display: 'block',
                objectFit: 'cover',
                maxHeight: '450px'
              }}
            />
          )}
        </div>
      </div>
      
      {/* Content with text wrap */}
      {children}
      
      {/* Clear the float after the content */}
      <div style={{ clear: 'both' }}></div>
    </div>
  );
}

export default ImageTextWrap;