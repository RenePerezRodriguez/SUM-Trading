'use client';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

type CatalogPaginationProps = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
};

export default function CatalogPagination({ currentPage, setCurrentPage, totalPages }: CatalogPaginationProps) {
    if (totalPages <= 1) return null;

    const renderPagination = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
    
        if (totalPages <= maxPagesToShow) {
          for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
        } else {
          if (currentPage <= 3) {
            pageNumbers.push(1, 2, 3, 4);
            pageNumbers.push('ellipsis-end');
            pageNumbers.push(totalPages);
          } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(1);
            pageNumbers.push('ellipsis-start');
            pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
          } else {
            pageNumbers.push(1);
            pageNumbers.push('ellipsis-start');
            pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
            pageNumbers.push('ellipsis-end');
            pageNumbers.push(totalPages);
          }
        }
    
        return (
          <Pagination>
            <PaginationContent>
              <PaginationPrevious 
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(Math.max(1, currentPage - 1)); }}
                className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
              />
              {pageNumbers.map((num, i) => {
                if (typeof num === 'string') {
                  return <PaginationEllipsis key={num + i} />;
                }
                return (
                  <PaginationItem key={num}>
                    <PaginationLink 
                      href="#"
                      isActive={num === currentPage}
                      onClick={(e) => { e.preventDefault(); setCurrentPage(num); }}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationNext 
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(Math.min(totalPages, currentPage + 1)); }}
                className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
              />
            </PaginationContent>
          </Pagination>
        );
      };

    return (
        <div className="mt-12">
            {renderPagination()}
        </div>
    );
}
