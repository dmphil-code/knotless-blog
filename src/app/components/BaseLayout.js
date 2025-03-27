// BaseLayout.js - Updated with side drawer mobile menu

"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useWindowSize from '../../hooks/useWindowSize'; 

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

  // If window size changes from mobile to desktop, close mobile menu
  useEffect(() => {
    if (windowSize.width >= 991 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [windowSize.width, isMobileMenuOpen]);

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
    // When opening menu, prevent body scrolling
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Clear body style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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
        height: '80px',
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
              src="/images/main-logo1.png"
              alt="Knotless Logo" 
              style={{
                height: '65px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Link>
        </div>
        
        {/* Navigation Links - Only visible on non-mobile screens */}
        <nav className="nav-links" style={{ 
          display: windowSize.width >= 991 ? 'flex' : 'none',
          alignItems: 'center',
          flex: 1,
          marginLeft: '64px',
        }}>
          <Link href="https://knotless.bookerhq.ca/home" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize'
          }}>
            Home
          </Link>
          <Link href="https://knotless.bookerhq.ca/aboutUs" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
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
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize'
          }}>
            Blog
          </Link>

          <Link href="/store" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize'
          }}>
            Store
          </Link>

          <Link href="https://knotless.bookerhq.ca/contactUs" className="nav-link" style={{
            margin: '0 1.25rem',
            textDecoration: 'none',
            color: '#333',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'capitalize'
          }}>
            Contact Us
          </Link>
        </nav>
        
        {/* Auth Buttons and Mobile Menu Button Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* Auth Buttons */}
          <div className="auth-buttons" style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: windowSize.width < 991 ? '1rem' : '0'
          }}>
            <Link href="https://knotless.bookerhq.ca/login" style={{ marginRight: '0.75rem' }}>
              <button style={{
                background: '#F4B637', // Yellow color
                color: '#333',
                padding: '0 1.25rem',
                borderRadius: '24px',
                border: 'none',
                height: '40px',
                fontSize: '14px',
                fontWeight: '400',
                fontFamily: 'Montserrat, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textTransform: 'capitalize'
              }}>
                Log In
              </button>
            </Link>
            <Link href="https://knotless.bookerhq.ca/login">
              <button style={{
                background: '#E9887E',
                color: 'white',
                padding: '0 1.25rem',
                borderRadius: '24px',
                border: 'none',
                height: '40px',
                fontSize: '14px',
                fontWeight: '400',
                fontFamily: 'Montserrat, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textTransform: 'capitalize'
              }}>
                Join
              </button>
            </Link>
          </div>
          
          {/* Mobile Menu Button - Moved to the right of auth buttons */}
          {windowSize.width < 991 && (
            <button 
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                zIndex: 200 // Ensure it stays on top when drawer is open
              }}
            >
              <div style={{
                width: '24px',
                height: '2px',
                backgroundColor: '#333',
                marginBottom: '5px',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }} />
              <div style={{
                width: '24px',
                height: '2px',
                backgroundColor: '#333',
                marginBottom: '5px',
                opacity: isMobileMenuOpen ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }} />
              <div style={{
                width: '24px',
                height: '2px',
                backgroundColor: '#333',
                transition: 'transform 0.3s ease',
                transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }} />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Side Drawer Menu */}
      {windowSize.width < 991 && (
        <>
          {/* Dark overlay when menu is open */}
          {isMobileMenuOpen && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 150,
                transition: 'opacity 0.3s ease',
                opacity: isMobileMenuOpen ? 1 : 0
              }}
              onClick={toggleMobileMenu}
            />
          )}
          
                      {/* Side drawer menu */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: isMobileMenuOpen ? 0 : '-100%',
            width: '100%',
            maxWidth: '400px', // Match the width from the reference image
            height: '100vh',
            backgroundColor: 'white',
            zIndex: 180,
            transition: 'right 0.3s ease',
            overflowY: 'auto',
            boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Menu header with close button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.75rem 1.5rem'
              // borderBottom: '1px solid #eee'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#222',
                fontFamily: 'Montserrat, sans-serif'
              }}>
                Menu
              </h2>
              <button
                onClick={toggleMobileMenu}
                aria-label="Close menu"
                style={{
                  background: '#E9887E',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Menu items - Styled to match the reference image */}
            <div style={{ padding: '0.5rem 0' }}>
              <Link 
                href="https://knotless.bookerhq.ca/home"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <span>Home</span>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: '#e9887e',
                  color: 'white'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </Link>
              
              <Link 
                href="https://knotless.bookerhq.ca/aboutUs"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <span>About</span>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: '#e9887e',
                  color: 'white'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </Link>
              
              <Link 
                href="https://knotless.bookerhq.ca/SearchResultsKnotless?searchTermHomePar"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <span>Stylists</span>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: '#e9887e',
                  color: 'white'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </Link>
              
              <Link 
                href="/"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <span>Blog</span>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: '#e9887e',
                  color: 'white'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </Link>
              
              <Link 
                href="/store"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <span>Store</span>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: '#e9887e',
                  color: 'white'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </Link>

              <Link 
                href="https://knotless.bookerhq.ca/contactUs"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <span>Contact Us</span>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: '#e9887e',
                  color: 'white'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </Link>
              
              {/* Light/Dark mode toggles - Styled to match the reference image */}
              <div style={{
                padding: '1rem 1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: '#f5f5f7',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  <button style={{
                    flex: 1,
                    background: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginRight: '0.5rem',
                    color: '#333'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>☀️</span>
                    Light Mode
                  </button>
                  <button style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>🌙</span>
                    Dark Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
  
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
      ) : pageType === 'store' ? (
        /* Content for Store Page */
        <main style={{ 
          backgroundColor: 'white',
          paddingTop: '80px', /* Account for the fixed header */
          minHeight: '70vh'
        }}>
          {children}
        </main>
      ) : (
        /* Regular Content for Other Pages */
        <main style={{ 
          backgroundColor: 'white',
          paddingTop: getTopPadding(),
          minHeight: '70vh'
        }}>
          {title && (
            <div style={{ padding: '2rem 1rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
              <h1 style={{ 
                fontSize: windowSize.width < 768 ? '2rem' : '2.5rem', 
                marginBottom: '1rem', 
                fontWeight: 'bold', 
                textAlign: 'center' 
              }}>
                {title}
              </h1>
              {description && (
                <p style={{ 
                  marginBottom: '2rem', 
                  color: '#666', 
                  textAlign: 'center',
                  fontSize: windowSize.width < 768 ? '1rem' : '1.25rem'
                }}>
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </main>
      )}

      {/* Footer with responsive adjustments */}
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
              maxWidth: '400px',
              width: windowSize.width < 768 ? '100%' : 'auto',
              textAlign: windowSize.width < 768 ? 'center' : 'left'
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
                  src="/images/main-logo1.png" 
                  alt="Knotless Logo" 
                  style={{
                    maxWidth: '200px',
                    height: 'auto',
                    margin: windowSize.width < 768 ? '0 auto' : '0'
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
              marginBottom: '2rem',
              width: windowSize.width < 768 ? '100%' : 'auto',
              textAlign: windowSize.width < 768 ? 'center' : 'left'
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
              <Link href="/store" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Store</Link>
              <Link href="https://knotless.bookerhq.ca/contactUs" style={{
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem'
              }}>Contact Us</Link>
            </div>
            
            {/* Terms Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '2rem',
              width: windowSize.width < 768 ? '100%' : 'auto',
              textAlign: windowSize.width < 768 ? 'center' : 'left'
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
            
            {/* Follow Us Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '2rem',
              width: windowSize.width < 768 ? '100%' : 'auto',
              textAlign: windowSize.width < 768 ? 'center' : 'left'
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