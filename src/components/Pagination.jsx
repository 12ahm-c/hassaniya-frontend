import React from "react";
import { FiChevronRight, FiChevronLeft, FiChevronsRight, FiChevronsLeft } from "react-icons/fi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        الصفحة {currentPage} من {totalPages}
      </div>
      
      <div className="flex items-center gap-1">
        {/* أول صفحة */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="الصفحة الأولى"
        >
          <FiChevronsRight size={18} />
        </button>
        
        {/* صفحة سابقة */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="الصفحة السابقة"
        >
          <FiChevronRight size={18} />
        </button>
        
        {/* أرقام الصفحات */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg transition-colors ${
              currentPage === page
                ? 'bg-teal-600 text-white'
                : 'hover:bg-teal-50 text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        {/* صفحة تالية */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="الصفحة التالية"
        >
          <FiChevronLeft size={18} />
        </button>
        
        {/* آخر صفحة */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="آخر صفحة"
        >
          <FiChevronsLeft size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;