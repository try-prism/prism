import '@/styles/tailwind.css';

import AmplifyProvider from '@/components/AmplifyProvider';
import BackgroundProvider from '@/components/BackgroundProvider';
import UserContextProvider from '@/contexts/UserContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: 'Prism AI',
  description: 'AI-driven knowledge management platform',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <AmplifyProvider>
      <UserContextProvider>
        <BackgroundProvider>{children}</BackgroundProvider>
      </UserContextProvider>
    </AmplifyProvider>
  );
}
