"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Layout({ children, title, description }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              My Blog
            </Link>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
          <nav className="nav-links">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/categories" className="nav-link">
              Categories
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {title && (
            <h1 className="page-title">{title}</h1>
          )}
          {description && (
            <p className="page-description">{description}</p>
          )}
          {children}
        </div>
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <Link href="/" className="logo">
              My Blog
            </Link>
            <p>Sharing insights and knowledge through our articles.</p>
          </div>
          <div className="social-links">
            <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}