import React from 'react';

export const Table = ({ children }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-neutral-200">
    <table className="min-w-full divide-y divide-neutral-200" role="table">
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-neutral-50">
    <tr>{children}</tr>
  </thead>
);

export const Th = ({ children }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
    {children}
  </th>
);

export const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-neutral-200">{children}</tbody>
);

export const TableRow = ({ children, onClick, interactive = false }) => (
  <tr
    className={`
      ${interactive ? 'cursor-pointer hover:bg-neutral-50 focus-within:bg-neutral-50' : ''}
      transition-colors duration-150 ease-in-out
    `}
    onClick={onClick}
    tabIndex={interactive ? 0 : -1}
    onKeyDown={interactive ? (e) => { if (e.key === 'Enter') onClick(); } : null}
    role={interactive ? 'button' : 'row'}
  >
    {children}
  </tr>
);

export const Td = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
); 