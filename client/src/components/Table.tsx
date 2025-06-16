import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string | null;
}

function Table<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  className = '',
  emptyMessage = 'No data available',
  loading = false,
  error = null,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4" role="alert">
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center text-gray-500 p-4" role="status">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`} role="region" aria-label="Data table">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                aria-sort={column.sortable ? 'none' : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(item => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none' : ''}`}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? 'button' : undefined}
              onKeyPress={e => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(item);
                }
              }}
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function'
                    ? (column.accessor(item) as React.ReactNode)
                    : (item[column.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
