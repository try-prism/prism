'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

interface RootLayoutProperties {
  children: React.ReactNode;
}

export default function BackgroundProvider({ children }: RootLayoutProperties) {
  const path = usePathname();
  return (
    <html
      lang="en"
      className={`min-h-full ${
        path === '/search' ? 'bg-white' : 'bg-gray-900'
      }`}
    >
      <body>{children}</body>
    </html>
  );
}
