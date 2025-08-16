'use client';
import type { ReactNode } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChatWidget } from './chat-widget';
import { useLanguage } from '@/context/language-context';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen">
      <Header title={pageTitle} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
