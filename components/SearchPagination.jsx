import React, { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const SearchPagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  fetchLoading,
  handlePagination,
}) => {
  // Validate inputs
  const validCurrentPage = Math.max(1, Math.min(currentPage || 1, totalPages || 1));
  const validTotalPages = Math.max(1, totalPages || 1);

  // Calculate visible page numbers
  const visiblePages = useMemo(() => {
    const pages = [];
    const maxVisible = 3;

    // Calculate range around current page
    let start = Math.max(1, validCurrentPage - Math.floor(maxVisible / 2));
    let end = Math.min(validTotalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Add pages in the visible range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [validCurrentPage, validTotalPages]);

  // Check if we should show first page and ellipsis
  const shouldShowFirstPage = useMemo(
    () => visiblePages[0] > 1,
    [visiblePages]
  );

  const shouldShowFirstEllipsis = useMemo(
    () => visiblePages[0] > 2,
    [visiblePages]
  );

  // Check if we should show last page and ellipsis
  const shouldShowLastPage = useMemo(
    () => visiblePages[visiblePages.length - 1] < validTotalPages,
    [visiblePages, validTotalPages]
  );

  const shouldShowLastEllipsis = useMemo(
    () => visiblePages[visiblePages.length - 1] < validTotalPages - 1,
    [visiblePages, validTotalPages]
  );

  const isFirstPage = validCurrentPage === 1;
  const isLastPage = validCurrentPage === validTotalPages;

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            disabled={isFirstPage || fetchLoading}
            onClick={() => !isFirstPage && handlePagination(validCurrentPage - 1)}
            className={isFirstPage ? "pointer-events-none" : ""}
          />
        </PaginationItem>

        {/* First Page Button and Ellipsis */}
        {shouldShowFirstPage && (
          <>
            <PaginationItem>
              <Button
                disabled={fetchLoading}
                onClick={() => handlePagination(1)}
                variant={validCurrentPage === 1 ? "default" : "outline"}
                className={validCurrentPage === 1 ? "bg-secondary text-white" : ""}
              >
                1
              </Button>
            </PaginationItem>
            {shouldShowFirstEllipsis && <PaginationEllipsis />}
          </>
        )}

        {/* Dynamic Page Buttons */}
        {visiblePages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <Button
              disabled={fetchLoading}
              onClick={() => handlePagination(pageNumber)}
              variant={validCurrentPage === pageNumber ? "default" : "outline"}
              className={
                validCurrentPage === pageNumber ? "bg-secondary text-white" : ""
              }
            >
              {fetchLoading && validCurrentPage === pageNumber ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                pageNumber
              )}
            </Button>
          </PaginationItem>
        ))}

        {/* Last Page Button and Ellipsis */}
        {shouldShowLastPage && (
          <>
            {shouldShowLastEllipsis && <PaginationEllipsis />}
            <PaginationItem>
              <Button
                disabled={fetchLoading}
                onClick={() => handlePagination(validTotalPages)}
                variant={validCurrentPage === validTotalPages ? "default" : "outline"}
                className={
                  validCurrentPage === validTotalPages
                    ? "bg-secondary text-white"
                    : ""
                }
              >
                {validTotalPages}
              </Button>
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            disabled={isLastPage || fetchLoading}
            onClick={() => !isLastPage && handlePagination(validCurrentPage + 1)}
            className={isLastPage ? "pointer-events-none" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default SearchPagination;