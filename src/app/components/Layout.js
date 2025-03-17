"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Layout({ children, title, description, onSearchSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Full-width hero container for the top section */}
      <div className="hero-container" style={{
        backgroundColor: '#E9887E', // Changed to salmon color from brand guidelines
        color: 'white',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <header className="site-header" style={{
          backgroundColor: 'transparent',
          padding: '1.5rem 0',
          width: '100%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div className="header-container" style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Logo and tagline centered */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Link href="/" className="logo" style={{
                textDecoration: 'none',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Knotless
              </Link>
              <p style={{ 
                fontSize: '1rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                detangling beauty
              </p>
            </div>
            
            {/* Nav container - left-justified with padding */}
            <div style={{ 
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {/* Desktop Navigation Links */}
              <nav className="nav-links" style={{ 
                display: 'flex',
                paddingLeft: '2rem'
              }}>
                <Link href="https://knotless.bookerhq.ca/home" className="nav-link" style={{
                  marginRight: '1.5rem',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.95rem'
                }}>
                  Home
                </Link>
                <Link href="https://knotless.bookerhq.ca/aboutUs" className="nav-link" style={{
                  marginRight: '1.5rem',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.95rem'
                }}>
                  About
                </Link>
                <Link href="https://knotless.bookerhq.ca/stylists" className="nav-link" style={{
                  marginRight: '1.5rem',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.95rem'
                }}>
                  Stylists
                </Link>
                <Link href="/" className="nav-link" style={{
                  marginRight: '1.5rem',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.95rem'
                }}>
                  Blog
                </Link>
                <Link href="https://knotless.bookerhq.ca/contactUs" className="nav-link" style={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.95rem'
                }}>
                  Contact Us
                </Link>
              </nav>

              {/* Mobile Menu Button - only visible on small screens */}
              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-button"
                style={{
                  display: 'none', // Would be controlled by media query in CSS
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: 'white'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              
              {/* Auth Buttons - with transparent background and white border */}
              <div className="auth-buttons">
                <button style={{
                  background: 'transparent',
                  color: 'white',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '2rem',
                  border: '1px solid white',
                  marginRight: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  Log In
                </button>
                <button style={{
                  background: 'transparent',
                  color: 'white',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '2rem',
                  border: '1px solid white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  Join
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation - only visible when menu is open on small screens */}
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
        </header>

        {/* Hero section content (will be provided by children) */}
        {!title && children && (
          <div className="hero-content">
            {children}
          </div>
        )}
      </div>

      {/* Search bar - hidden but code preserved */}
      <div className="sticky-search" style={{ 
        display: 'none', // Hidden from UI
        boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
      }}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button 
            type="submit"
            className="search-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>

      {/* Main Content (conditionally rendered based on whether it's the hero section) */}
      <main className="main-content" style={{ 
        backgroundColor: 'white',
        paddingTop: title ? '3rem' : '0'
      }}>
        {title && (
          <div className="container mx-auto px-4" style={{ padding: '2rem 1rem 1rem' }}>
            <h1 className="page-title">{title}</h1>
            {description && (
              <p className="page-description" style={{ 
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
        
        {/* Render remaining children or all children if there's a title */}
        {title ? children : !title && (
          <div className="non-hero-content">
            {/* Only show non-hero content in the main content area */}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#F5F5F5',
        padding: '3rem 0',
        marginTop: '2rem'
      }}>
        <div className="footer-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div className="footer-content" style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <div className="footer-brand" style={{
              marginBottom: '2rem',
              maxWidth: '400px'
            }}>
              <Link href="/" style={{
                textDecoration: 'none',
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#E9887E',
                display: 'block',
                marginBottom: '1rem'
              }}>
                Knotless
              </Link>
              <p style={{ 
                color: '#666',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>
                Connecting clients with professional stylists for all your hair care needs.
              </p>
            </div>
            
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
              <Link href="https://knotless.bookerhq.ca/stylists" style={{
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
              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                  textDecoration: 'none',
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  Twitter
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                  textDecoration: 'none',
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                  textDecoration: 'none',
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  Facebook
                </a>
              </div>
            </div>
          </div>
          
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