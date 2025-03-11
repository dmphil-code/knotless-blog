export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  // Create an array of page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than our max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise, show a window of pages around the current page
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust start page if needed
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (startPage > 1) {
        pageNumbers.unshift('...');
        pageNumbers.unshift(1);
      }
      
      if (endPage < totalPages) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="pagination">
      {/* Previous button */}
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        &lt; Prev
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}
      
      {/* Next button */}
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        Next &gt;
      </button>
    </div>
  );
}