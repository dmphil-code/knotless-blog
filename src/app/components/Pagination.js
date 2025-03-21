import { useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768;
  
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  // Create an array of page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    // On mobile, show fewer pages
    const maxPagesToShow = isMobile ? 3 : 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than our max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise, show a window of pages around the current page
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust start page if needed
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed - on mobile show fewer indicators
      if (startPage > 1) {
        if (startPage > 2 && !isMobile) {
          pageNumbers.unshift('...');
        }
        pageNumbers.unshift(1);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1 && !isMobile) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="pagination" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: isMobile ? '5px' : '10px',
      margin: '40px 0 20px',
      flexWrap: 'wrap'
    }}>
      {/* Previous button */}
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ 
          padding: isMobile ? '6px 12px' : '8px 16px',
          border: '1px solid #ddd',
          backgroundColor: 'white',
          borderRadius: '4px',
          cursor: 'pointer',
          color: '#444',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? '0.8rem' : '0.9rem',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
      >
        {isMobile ? '<' : '< Prev'}
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={typeof page !== 'number'}
          style={{
            padding: isMobile ? '6px 10px' : '8px 16px',
            border: '1px solid #ddd',
            backgroundColor: page === currentPage ? '#E9887E' : 'white',
            color: page === currentPage ? 'white' : '#444',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            borderColor: page === currentPage ? '#E9887E' : '#ddd'
          }}
        >
          {page}
        </button>
      ))}
      
      {/* Next button */}
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: isMobile ? '6px 12px' : '8px 16px',
          border: '1px solid #ddd',
          backgroundColor: 'white',
          borderRadius: '4px',
          cursor: 'pointer',
          color: '#444',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? '0.8rem' : '0.9rem',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
      >
        {isMobile ? '>' : 'Next >'}
      </button>
    </div>
  );
}