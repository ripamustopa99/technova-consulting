'use client';

import React from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  minWidth?: number | string;
  className?: string;
}

/**
 * Wrapper component untuk membuat tabel Ant Design responsif di mobile.
 * - Overflow horizontal scroll otomatis
 * - Custom scrollbar tipis & clean
 * - min-width default 600px agar tabel tidak menciut
 *
 * Usage:
 *   <ResponsiveTable>
 *     <Table columns={columns} dataSource={data} />
 *   </ResponsiveTable>
 */
export default function ResponsiveTable({
  children,
  minWidth = 600,
  className = '',
}: ResponsiveTableProps) {
  const widthValue = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;

  return (
    <div className={`table-scroll-wrapper ${className}`}>
      <div style={{ minWidth: widthValue }}>
        {children}
      </div>
    </div>
  );
}
