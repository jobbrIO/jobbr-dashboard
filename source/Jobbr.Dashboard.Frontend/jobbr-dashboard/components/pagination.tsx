import React from "react";

export default function Pagination({ pagedResult }) {
  const { page, pageSize, totalItems } = pagedResult;
  const lastPage = Math.ceil(totalItems / pageSize);

  const pages: number[] = [];

  for (let i = page - 5; i <= page + 5; ++i) {
    if (i < 1) {
      continue;
    }

    if (i > lastPage) {
      break;
    }

    pages.push(i);
  }

  return (
    <div className="d-flex justify-content-between">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <span className="page-link">Previous</span>
          </li>
          {pages.map((pageNumber) => (
            <li className={`page-item ${page === pageNumber ? "active" : ""}`} key={pageNumber}>
              <a className="page-link" href="javascript:void(0);">
                {pageNumber}
              </a>
            </li>
          ))}
          <li className={`page-item ${page === lastPage ? "disabled" : ""}`}>
            <a className="page-link" href="javascript:void(0);">
              Next
            </a>
          </li>
        </ul>
      </nav>
      <div>{totalItems} items</div>
    </div>
  );
}
