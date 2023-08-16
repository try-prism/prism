import '@/styles/tailwind.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: 'Prism AI',
  description: 'AI-driven knowledge management platform',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="min-h-full bg-main-black">
      <body>{children}</body>
    </html>
  );
}
