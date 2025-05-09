// BaseLayout.js - Complete implementation

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
  const [darkMode, setDarkMode] = useState(false);
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

  // Apply dark mode to body when toggled
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

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

  // Toggle between dark and light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Clear body style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: darkMode ? '#121212' : 'white',
      color: darkMode ? 'white' : '#333',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      {/* Sticky Header - Updated styling to match Header 2 */}
      <header className="site-header" style={{
        backgroundColor: darkMode ? '#1a1a1a' : '#f8f8f8', // Lighter background color
        padding: '0.5rem 0', // No horizontal padding for the header
        position: 'fixed',
        top: 0,
        left: 0,
        height: '80px', // Increased to 80px
        width: '100%',
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        transition: 'background-color 0.3s ease',
        overflow: 'hidden' // Prevent logo overflow
      }}>
        {/* Parent row for logo and navigation */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between', // Changed to space-between to push auth buttons to right
          height: '100%',
          width: '100%',
          paddingLeft: windowSize.width >= 991 ? '6px' : '3px', // Minimal left padding for logo
          paddingRight: windowSize.width >= 991 ? '6px' : '3px', // Minimal right padding for auth buttons
        }}>
          {/* Left section container for logo and nav */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}>
            {/* Logo container */}
            <div className="logo" style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center',
              marginRight: '48px', // 48px spacing between logo and nav
              width: '200px', // Set a fixed width for the logo container
              marginLeft: '0', // Remove any left margin
            }}>
              <Link href="https://knotless.co/home" style={{ 
                display: 'block',
                height: '100%',
                width: '100%'
              }}>
                <img 
                  src="/images/main-logo1.png"
                  alt="Knotless Logo" 
                  style={{
                    height: 'auto', // Auto height
                    width: '100%', // Fill the container width
                    maxHeight: '78px', // Increased to match taller header
                    objectFit: 'contain', // Changed back to contain for better quality
                    transform: 'scale(1.3)', // Scale up the logo
                    transformOrigin: 'left center', // Scale from left center
                    marginTop: '-6px', // Push logo up by 6 pixels
                  }}
                />
              </Link>
            </div>
            
            {/* Navigation Links - Only visible on non-mobile screens */}
            <nav className="nav-links" style={{ 
              display: windowSize.width >= 991 ? 'flex' : 'none',
              alignItems: 'center',
              gap: '12px', // 12px spacing between nav items
            }}>
              <Link href="https://knotless.co/home" className="nav-link" style={{
                textDecoration: 'none',
                color: darkMode ? '#e0e0e0' : '#333',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'capitalize',
                fontWeight: '400', // Lighter font weight
                transition: 'color 0.3s ease'
              }}>
                Home
              </Link>
              <Link href="https://knotless.co/aboutUs" className="nav-link" style={{
                textDecoration: 'none',
                color: darkMode ? '#e0e0e0' : '#333',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'capitalize',
                fontWeight: '400',
                transition: 'color 0.3s ease'
              }}>
                About
              </Link>
              {/* <Link href="https://knotless.co/SearchResultsKnotless?searchTermHomePar" className="nav-link" style={{
                textDecoration: 'none',
                color: darkMode ? '#e0e0e0' : '#333',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'capitalize',
                fontWeight: '400',
                transition: 'color 0.3s ease'
              }}>
                Stylists
              </Link> */}
              <Link href="/" className="nav-link" style={{
                textDecoration: 'none',
                color: darkMode ? '#e0e0e0' : '#333',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'capitalize',
                fontWeight: '400',
                transition: 'color 0.3s ease'
              }}>
                Blog
              </Link>
              {/* <Link href="/store" className="nav-link" style={{
                textDecoration: 'none',
                color: darkMode ? '#e0e0e0' : '#333',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'capitalize',
                fontWeight: '400',
                transition: 'color 0.3s ease'
              }}>
                Store
              </Link> */}
              <Link href="https://knotless.co/contactUs" className="nav-link" style={{
                textDecoration: 'none',
                color: darkMode ? '#e0e0e0' : '#333',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'capitalize',
                fontWeight: '400',
                transition: 'color 0.3s ease'
              }}>
                Contact Us
              </Link>
            </nav>
          </div>
          
          {/* Auth Buttons + Mobile Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingRight: '12px' // Added padding to the right of auth buttons
          }}>
            {/* Auth Buttons in their own row */}
            <div className="auth-buttons" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px', // Reduced gap between buttons
              padding: '6px' // Added padding around the auth buttons
            }}>
              <Link href="https://knotless.co/login">
                <button style={{
                  background: '#F4B637', // Yellow color
                  color: '#333',
                  padding: '0 1.25rem',
                  borderRadius: '24px',
                  border: 'none',
                  height: '38px', // Slightly reduced height
                  fontSize: '14px',
                  fontWeight: '400', // Lighter font weight
                  fontFamily: 'Montserrat, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  textTransform: 'capitalize'
                }}>
                  Log In
                </button>
              </Link>
              <Link href="https://knotless.co/login">
                <button style={{
                  background: '#E9887E',
                  color: 'white',
                  padding: '0 1.25rem',
                  borderRadius: '24px',
                  border: 'none',
                  height: '38px', // Slightly reduced height
                  fontSize: '14px',
                  fontWeight: '400', // Lighter font weight
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
            
            {/* Mobile Menu Button - Only visible on mobile */}
            {windowSize.width < 991 && (
              <button 
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  zIndex: 200
                }}
              >
                <div style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: darkMode ? 'white' : '#333',
                  marginBottom: '5px',
                  transition: 'transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                }} />
                <div style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: darkMode ? 'white' : '#333',
                  marginBottom: '5px',
                  opacity: isMobileMenuOpen ? 0 : 1,
                  transition: 'opacity 0.3s ease, background-color 0.3s ease'
                }} />
                <div style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: darkMode ? 'white' : '#333',
                  transition: 'transform 0.3s ease, background-color 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
                }} />
              </button>
            )}
          </div>
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
            maxWidth: '400px',
            height: '100vh',
            backgroundColor: darkMode ? '#1a1a1a' : 'white',
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
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '600',
                color: darkMode ? '#e0e0e0' : '#222',
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
            
            {/* Menu items */}
            <div style={{ padding: '0.5rem 0' }}>
              <Link 
                href="https://knotless.co/home"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: darkMode ? '#e0e0e0' : '#333',
                  borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}`,
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
                href="https://knotless.co/aboutUs"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: darkMode ? '#e0e0e0' : '#333',
                  borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}`,
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
              
              {/* <Link 
                href="https://knotless.co/SearchResultsKnotless?searchTermHomePar"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: darkMode ? '#e0e0e0' : '#333',
                  borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}`,
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
              </Link> */}
              
              <Link 
                href="/"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: darkMode ? '#e0e0e0' : '#333',
                  borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}`,
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
              
              {/* <Link 
                href="/store"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: darkMode ? '#e0e0e0' : '#333',
                  borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}`,
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
              </Link> */}

              <Link 
                href="https://knotless.co/contactUs"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: darkMode ? '#e0e0e0' : '#333',
                  borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}`,
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
              
              {/* Light/Dark mode toggles */}
              <div style={{
                padding: '1rem 1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: darkMode ? '#333' : '#f5f5f7',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  <button 
                    onClick={() => setDarkMode(false)}
                    style={{
                      flex: 1,
                      background: !darkMode ? 'white' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: !darkMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      marginRight: '0.5rem',
                      color: darkMode ? '#aaa' : '#333'
                    }}
                  >
                    <span style={{ marginRight: '0.5rem' }}>☀️</span>
                    Light Mode
                  </button>
                  <button 
                    onClick={() => setDarkMode(true)}
                    style={{
                      flex: 1,
                      background: darkMode ? 'white' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      color: darkMode ? '#333' : '#666'
                    }}
                  >
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
          <div className="hero-container" style={{
            backgroundColor: darkMode ? '#121212' : undefined,
            color: darkMode ? '#e0e0e0' : undefined
          }}>
            {Array.isArray(children) && children.length > 0 ? children[0] : null}
          </div>
          
          {/* Main Content for Home Page */}
          <main className="main-content" style={{ 
            backgroundColor: darkMode ? '#121212' : 'white',
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
          backgroundColor: darkMode ? '#121212' : 'white',
          paddingTop: '80px', /* Adjusted for the 80px header height */
          minHeight: '70vh',
          color: darkMode ? '#e0e0e0' : 'inherit'
        }}>
          {children}
        </main>
      ) : (
        /* Regular Content for Other Pages */
        <main style={{ 
          backgroundColor: darkMode ? '#121212' : (pageType === 'article' ? '#FFE8C9' : 'white'),
          paddingTop: getTopPadding(),
          minHeight: '70vh',
          color: darkMode ? '#e0e0e0' : 'inherit'
        }}>
          {title && (
            <div style={{ padding: '2rem 1rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
              <h1 style={{ 
                fontSize: windowSize.width < 768 ? '2rem' : '2.5rem', 
                marginBottom: '1rem', 
                fontWeight: 'bold', 
                textAlign: 'center',
                color: darkMode ? '#e0e0e0' : '#333'
              }}>
                {title}
              </h1>
              {description && (
                <p style={{ 
                  marginBottom: '2rem', 
                  color: darkMode ? '#aaa' : '#666', 
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
        backgroundColor: darkMode ? '#1a1a1a' : '#F5F5F5',
        padding: '3rem 0',
        marginTop: '2rem',
        color: darkMode ? '#e0e0e0' : 'inherit',
        transition: 'background-color 0.3s ease'
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
              <Link href="https://knotless.co/home" style={{
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
                color: darkMode ? '#aaa' : '#666',
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
                color: darkMode ? '#e0e0e0' : '#333'
              }}>Quick Links</h3>
              <Link href="https://knotless.co/home" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem'
              }}>Home</Link>
              <Link href="https://knotless.co/aboutUs" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem'
              }}>About</Link>
              {/* <Link href="https://knotless.co/SearchResultsKnotless?searchTermHomePar" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem'
              }}>Stylists</Link> */}
              <Link href="/" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem'
              }}>Blog</Link>
              {/* <Link href="/store" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem'
              }}>Store</Link> */}
              <Link href="https://knotless.co/contactUs" style={{
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
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
                color: darkMode ? '#e0e0e0' : '#333'
              }}>Terms</h3>
              <Link href="https://knotless.co/PrivacyPolicy" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem'
              }}>Privacy Policy</Link>
              <Link href="https://knotless.co/TermsOfService" style={{
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem'
              }}>Terms of Service</Link>
              <Link href="/" style={{
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
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
                color: darkMode ? '#e0e0e0' : '#333'
              }}>Follow Us</h3>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem',
                marginBottom: '0.5rem'
              }}>
                Twitter
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem',
                marginBottom: '0.5rem'
              }}>
                Instagram
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                textDecoration: 'none',
                color: darkMode ? '#aaa' : '#666',
                fontSize: '0.95rem'
              }}>
                Facebook
              </Link>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div style={{
            borderTop: darkMode ? '1px solid #333' : '1px solid #ddd',
            paddingTop: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ color: darkMode ? '#aaa' : '#666', fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} Knotless. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Add CSS for dark mode transitions */}
      <style jsx global>{`
        body {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        .dark-mode {
          background-color: #121212;
          color: #e0e0e0;
        }
        
        /* Improved hover effects for nav links */
        .nav-link:hover {
          color: ${darkMode ? '#FFD700' : '#E9887E'} !important;
        }
      `}</style>
    </div>
  );
}