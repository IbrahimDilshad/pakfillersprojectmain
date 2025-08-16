import type { ReactNode } from 'react';
import { Header } from '@/components/header';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title={pageTitle} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
