'use client';
import { usePathname } from 'next/navigation';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function BackgroundProvider({ children }: RootLayoutProps) {
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
