"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useWindowSize from '../hooks/useWindowSize'; 

export default function BaseLayout({ 
  children, 
  pageType = 'default',  // 'default', 'article', 'home'
  onSearchSubmit = null,
  title = null,
  description = null
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const windowSize = useWindowSize();
  
  // Determine if the layout should use dark mode (for hero section)
  const isDarkMode = pageType === 'home' && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate responsive padding values based on window size
  const getTopPadding = () => {
    const width = windowSize.width || 0;
    
    if (pageType === 'article') {
      if (width >= 1440) return '160px';      // Extra large screens - article
      if (width >= 1024) return '140px';      // Large screens - article
      if (width >= 768) return '120px';       // Medium screens - article
      return '110px';                         // Small screens - article
    } else {
      if (width >= 1440) return '140px';      // Extra large screens - other pages
      if (width >= 1024) return '120px';      // Large screens - other pages
      if (width >= 768) return '100px';       // Medium screens - other pages
      return '90px';                          // Small screens - other pages
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Colors based on page type and scroll state
  const getHeaderBgColor = () => {
    if (isScrolled) return '#E9887E';
    if (pageType === 'home') return 'transparent';
    return 'white';
  };

  const getTextColor = () => {
    if (isScrolled) return 'white';
    if (pageType === 'home') return 'white';
    return '#333';
  };

  const getLogoColor = () => {
    if (isScrolled) return 'white';
    if (pageType === 'home') return 'white';
    return '#E9887E';
  };

  const getSubtitleColor = () => {
    if (isScrolled) return 'rgba(255, 255, 255, 0.9)';
    if (pageType === 'home') return 'rgba(255, 255, 255, 0.9)';
    return '#773800';
  };

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Sticky Header */}
      <header className="site-header" style={{
        backgroundColor: '#f5f5f5', // Light gray background
        padding: '0.75rem 2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo - Left aligned, enlarged */}
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'block' }}>
            <img 
              src="/images/main-logo.png"
              alt="Knotless Logo" 
              style={{
                height: '65px', // Enlarged logo height
                width: 'auto',
                objectFit: 'contain' // Helps maintain quality when resizing
              }}
            />
          </Link>
        </div>
        
        {/* Navigation Links - Positioned closer to logo */}
        <nav className="nav-links" style={{ 
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          marginLeft: '64px', // Specific spacing from logo as requested
        }}>
          <Link href="https://knotless.bookerhq.ca/home" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
            fontWeight: '400',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize' // Ensures proper case
          }}>
            Home
          </Link>
          <Link href="https://knotless.bookerhq.ca/aboutUs" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
            fontWeight: '400',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize'
          }}>
            About
          </Link>
          <Link href="https://knotless.bookerhq.ca/SearchResultsKnotless?searchTermHomePar" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
            fontWeight: '400',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize'
          }}>
            Stylists
          </Link>
          <Link href="/" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
            fontWeight: '400',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize'
          }}>
            Blog
          </Link>
          <Link href="https://knotless.bookerhq.ca/contactUs" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
            fontWeight: '400',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize'
          }}>
            Contact Us
          </Link>
        </nav>
        
        {/* Auth Buttons - Updated with elevation and rounded corners */}
        <div className="auth-buttons" style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <Link href="https://knotless.bookerhq.ca/login" style={{ marginRight: '0.75rem' }}>
            <button style={{
              background: '#F4B637', // Yellow color
              color: '#333',
              padding: '0 1.25rem',
              borderRadius: '24px', // Rounded corners as requested
              border: 'none',
              height: '40px',
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Elevation 1
              textTransform: 'capitalize'
            }}>
              Log In
            </button>
          </Link>
          <Link href="https://knotless.bookerhq.ca/signup">
            <button style={{
              background: '#E9887E', // Pink color
              color: 'white',
              padding: '0 1.25rem',
              borderRadius: '24px', // Rounded corners as requested
              border: 'none',
              height: '40px',
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Elevation 1
              textTransform: 'capitalize'
            }}>
              Join
            </button>
          </Link>        

        {/* Mobile Navigation - Only visible when menu is open on small screens */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav" style={{
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'none' // This would be shown with media queries in CSS
          }}>
            <Link href="https://knotless.bookerhq.ca/home" className="mobile-nav-link" style={{
              display: 'block',
              padding: '0.75rem 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none'
            }}>
              Home
            </Link>
            <Link href="https://knotless.bookerhq.ca/aboutUs" className="mobile-nav-link" style={{
              display: 'block',
              padding: '0.75rem 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none'
            }}>
              About
            </Link>
            <Link href="https://knotless.bookerhq.ca/stylists" className="mobile-nav-link" style={{
              display: 'block',
              padding: '0.75rem 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none'
            }}>
              Stylists
            </Link>
            <Link href="/" className="mobile-nav-link" style={{
              display: 'block',
              padding: '0.75rem 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none'
            }}>
              Blog
            </Link>
            <Link href="https://knotless.bookerhq.ca/contactUs" className="mobile-nav-link" style={{
              display: 'block',
              padding: '0.75rem 0',
              color: 'white',
              textDecoration: 'none'
            }}>
              Contact Us
            </Link>
          </nav>
        )}
      </div>
      </header>
  
      {/* Main Content */}
      {pageType === 'home' ? (
        <>
          {/* Hero Container for Home Page */}
          <div className="hero-container">
            {Array.isArray(children) && children.length > 0 ? children[0] : null}
          </div>
          
          {/* Main Content for Home Page */}
          <main className="main-content" style={{ 
            backgroundColor: 'white',
            position: 'relative'
          }}>
            {Array.isArray(children) && children.length > 1 
              ? children.slice(1) 
              : (!Array.isArray(children) ? children : null)}
          </main>
        </>
      ) : (
        /* Regular Content for Other Pages */
        <main style={{ 
          backgroundColor: 'white',
          paddingTop: getTopPadding(), // Extra padding for article pages
          minHeight: '70vh'
        }}>
          {title && (
            <div style={{ padding: '2rem 1rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>{title}</h1>
              {description && (
                <p style={{ 
                  marginBottom: '2rem', 
                  color: '#666', 
                  textAlign: 'center',
                  fontSize: '1.25rem'
                }}>
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </main>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: '#F5F5F5',
        padding: '3rem 0',
        marginTop: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {/* Brand Section (Left) */}
            <div style={{
              marginBottom: '2rem',
              maxWidth: '400px'
            }}>
              <Link href="https://knotless.bookerhq.ca/" style={{
                textDecoration: 'none',
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#E9887E',
                display: 'block',
                marginBottom: '1rem'
              }}>
                    <img 
                    src="/images/main-logo.png" 
                    alt="Knotless Logo" 
                    style={{
                      maxWidth: '200px', // Adjust the size as needed
                      height: 'auto'
                    }}
                  />
              </Link>
              <p style={{ 
                color: '#666',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>
                Connecting clients with professional stylists for all your hair care needs.
              </p>
            </div>
            
            {/* Quick Links Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#333'
              }}>Quick Links</h3>
              <Link href="https://knotless.bookerhq.ca/home" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Home</Link>
              <Link href="https://knotless.bookerhq.ca/aboutUs" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>About</Link>
              <Link href="https://knotless.bookerhq.ca/SearchResultsKnotless?searchTermHomePar" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Stylists</Link>
              <Link href="/" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Blog</Link>
              <Link href="https://knotless.bookerhq.ca/contactUs" style={{
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Contact Us</Link>
            </div>
            
            {/* Terms Section (New) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#333'
              }}>Terms</h3>
              <Link href="https://knotless.bookerhq.ca/PrivacyPolicy" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Privacy Policy</Link>
              <Link href="https://knotless.bookerhq.ca/TermsOfService" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Terms of Service</Link>
              <Link href="/" style={{
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Land Acknowledgement</Link>
            </div>
            
            {/* Follow Us Section (Vertical) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#333'
              }}>Follow Us</h3>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem',
                marginBottom: '0.5rem'
              }}>
                Twitter
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem',
                marginBottom: '0.5rem'
              }}>
                Instagram
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>
                Facebook
              </Link>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div style={{
            borderTop: '1px solid #ddd',
            paddingTop: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} Knotless. All rights reserved.
            </p>
          </div>
        </div>
      </footer>   
</div>
  );
}