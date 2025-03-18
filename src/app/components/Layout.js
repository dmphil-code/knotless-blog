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
      {/* Sticky Header */}
      <header className="site-header" style={{
        backgroundColor: isScrolled ? '#E9887E' : 'transparent',
        padding: '1rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        transition: 'background-color 0.3s ease',
        boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
      }}>
        <div className="header-container" style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Navigation Links - Left aligned */}
          <nav className="nav-links" style={{ 
            display: 'flex',
            alignItems: 'center'
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
              Contact
            </Link>
          </nav>
          
          {/* Logo - Center aligned */}
          <div className="logo-container" style={{ 
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <Link href="/" className="logo" style={{
              textDecoration: 'none',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              display: 'block'
            }}>
              Knotless
            </Link>
            <p style={{ 
              fontSize: '0.8rem', 
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '0.25rem'
            }}>
              detangling beauty
            </p>
          </div>

          {/* Login Buttons - Right aligned */}
          <div className="auth-buttons" style={{
            display: 'flex',
            alignItems: 'center'
          }}>
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
          
          {/* Mobile Menu Button - Hidden on desktop */}
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
        </div>
          
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
      </header>

      {/* Hero Section Container */}
      {!title && (
        <div className="hero-container" style={{
          backgroundColor: '#E9887E',
          color: 'white',
          position: 'relative',
          width: '100%',
          padding: '116px 0 80px',
          marginTop: '0'
        }}>
          {children.length > 0 && children[0]}
        </div>
      )}

      {/* Main Content */}
      <main className="main-content" style={{ 
        backgroundColor: 'white',
        paddingTop: '2rem'
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
            {children}
          </div>
        )}
        
        {/* Render remaining children if there's no title */}
        {!title && (
          <div className="non-hero-content" style={{ position: 'relative' }}>
            {/* Show only non-hero children in the main content area */}
            {children.length > 1 ? children.slice(1) : null}
          </div>
        )}
      </main>

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
            <div style={{
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