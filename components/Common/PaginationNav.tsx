import React from 'react';

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  align?: 'start' | 'end';
}

// Shows the first and last page, and two pages on each side of the current one:
// 1 … 4 5 [6] 7 8 … 50
const getPageItems = (currentPage: number, totalPages: number): Array<number | 'ellipsis'> => {
  const pages = new Set<number>([1, totalPages]);
  for (let page = currentPage - 2; page <= currentPage + 2; page++) {
    if (page >= 1 && page <= totalPages) pages.add(page);
  }

  const items: Array<number | 'ellipsis'> = [];
  let previous = 0;
  Array.from(pages).sort((a, b) => a - b).forEach((page) => {
    if (page - previous > 1) items.push('ellipsis');
    items.push(page);
    previous = page;
  });
  return items;
};

const PaginationNav: React.FC<PaginationNavProps> = ({ currentPage, totalPages, onPageChange, disabled, align = 'end' }) => {
  const lastPage = Math.max(totalPages || 0, 1);
  const goTo = (page: number) => {
    if (disabled || page < 1 || page > lastPage || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav aria-label="Page navigation">
      <ul className={`pagination justify-content-${align} flex-wrap mb-0`}>
        <li className={`page-item ${currentPage <= 1 || disabled ? 'disabled' : ''}`}>
          <a className="page-link" role="button" onClick={() => goTo(currentPage - 1)}>
            Previous
          </a>
        </li>

        {getPageItems(currentPage, lastPage).map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li
              key={item}
              className={`page-item ${item === currentPage ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
            >
              <a className="page-link" role="button" onClick={() => goTo(item)}>
                {item}
              </a>
            </li>
          )
        )}

        <li className={`page-item ${currentPage >= lastPage || disabled ? 'disabled' : ''}`}>
          <a className="page-link" role="button" onClick={() => goTo(currentPage + 1)}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationNav;
