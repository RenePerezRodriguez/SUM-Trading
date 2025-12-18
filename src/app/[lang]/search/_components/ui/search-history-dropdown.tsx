'use client';

import { useSearchHistory } from '@/hooks/use-search-history';
import { Clock, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchHistoryDropdownProps {
  onSelectQuery: (query: string) => void;
}

export function SearchHistoryDropdown({ onSelectQuery }: SearchHistoryDropdownProps) {
  const { history, removeSearch, clearHistory, getFormattedTime, isLoaded } = useSearchHistory();

  if (!isLoaded || history.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-w-md">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Búsquedas Recientes
          </h3>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="h-6 text-xs hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          {history.map((item) => (
            <div
              key={item.timestamp}
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 group cursor-pointer"
              onClick={() => onSelectQuery(item.query)}
            >
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.query}
                </p>
                <p className="text-xs text-gray-500">
                  {getFormattedTime(item.timestamp)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSearch(item.query);
                }}
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
