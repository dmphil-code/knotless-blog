"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Layout({ children, title, description, onSearchSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <header style={{ backgroundColor: '#F5F5F5', padding: '0.75rem 0', width: '100%' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" className="logo" style={{ textDecoration: 'none', marginRight: '4rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#E9887E' }}>Knotless</div>
            </Link>
            <nav className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
              <Link href="https://knotless.bookerhq.ca/home" className="nav-link" style={{ marginRight: '1.5rem', textDecoration: 'none', color: '#333' }}>
                Home
              </Link>
              <Link href="https://knotless.bookerhq.ca/aboutUs" className="nav-link" style={{ marginRight: '1.5rem', textDecoration: 'none', color: '#333' }}>
                About
              </Link>
              <Link href="https://knotless.bookerhq.ca/stylists" className="nav-link" style={{ marginRight: '1.5rem', textDecoration: 'none', color: '#333' }}>
                Stylists
              </Link>
              <Link href="/" className="nav-link" style={{ marginRight: '1.5rem', textDecoration: 'none', color: '#333' }}>
                Blog
              </Link>
              <Link href="https://knotless.bookerhq.ca/contactUs" className="nav-link" style={{ textDecoration: 'none', color: '#333' }}>
                Contact Us
              </Link>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button style={{ 
              backgroundColor: '#F4B637', 
              color: '#333', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '2rem', 
              border: 'none',
              marginRight: '0.75rem',
              fontSize: '16px',
              fontWeight: 'normal',
              cursor: 'pointer'
            }}>
              Log In
            </button>
            <button style={{ 
              backgroundColor: '#E9887E', 
              color: 'white', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '2rem', 
              border: 'none',
              fontSize: '16px',
              fontWeight: 'normal',
              cursor: 'pointer'
            }}>
              Join
            </button>
          </div>
        </div>
      </header>

      <div style={{ 
        position: 'sticky', 
        top: '0', 
        zIndex: '100',
        backgroundColor: '#FFF', 
        padding: '1rem 0',
        boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        width: '100%',
        transition: 'box-shadow 0.3s ease',
        textAlign: 'center'
      }}>
        <form onSubmit={handleSearch} style={{ 
          width: '100%', 
          maxWidth: '450px', 
          margin: '0 auto',
          display: 'flex'
        }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              flex: '1', 
              padding: '0.9rem 1rem', 
              border: '1px solid #ddd', 
              borderRadius: '0.5rem 0 0 0.5rem', 
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
          <button 
            type="submit"
            style={{ 
              backgroundColor: '#E9887E', 
              color: 'white', 
              border: 'none', 
              padding: '0.9rem 1.2rem', 
              borderRadius: '0 0.5rem 0.5rem 0', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>

      <main className="main-content" style={{ padding: '2rem 0', backgroundColor: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          {title && (
            <h1 className="page-title" style={{ marginBottom: '1rem' }}>{title}</h1>
          )}
          {description && (
            <p className="page-description" style={{ marginBottom: '2rem', color: '#666' }}>{description}</p>
          )}
          {children}
        </div>
      </main>

      <footer style={{ backgroundColor: '#F5F5F5', padding: '2rem 0', marginTop: '2rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="footer-content" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
              <Link href="/" className="logo" style={{ display: 'block', marginBottom: '1rem', textDecoration: 'none' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#E9887E' }}>Knotless</div>
              </Link>
              <p style={{ color: '#666' }}>Connecting clients with professional stylists for all your hair care needs.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Quick Links</h3>
              <Link href="https://knotless.bookerhq.ca/home" style={{ marginBottom: '0.5rem', textDecoration: 'none', color: '#666' }}>Home</Link>
              <Link href="https://knotless.bookerhq.ca/aboutUs" style={{ marginBottom: '0.5rem', textDecoration: 'none', color: '#666' }}>About</Link>
              <Link href="https://knotless.bookerhq.ca/stylists" style={{ marginBottom: '0.5rem', textDecoration: 'none', color: '#666' }}>Stylists</Link>
              <Link href="/" style={{ marginBottom: '0.5rem', textDecoration: 'none', color: '#666' }}>Blog</Link>
              <Link href="https://knotless.bookerhq.ca/contactUs" style={{ textDecoration: 'none', color: '#666' }}>Contact Us</Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Follow Us</h3>
              <div className="social-links" style={{ display: 'flex', gap: '1rem' }}>
                <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#666' }}>
                  Twitter
                </a>
                <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#666' }}>
                  Instagram
                </a>
                <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#666' }}>
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '1.5rem' }}>
            <p className="copyright" style={{ color: '#666', textAlign: 'center' }}>&copy; {new Date().getFullYear()} Knotless. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}