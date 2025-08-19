
'use client';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChatWidget } from './chat-widget';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
                <div className="flex items-center gap-2 mr-auto">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-64 w-full" />
                     <Skeleton className="h-32 w-full" />
                </div>
            </main>
        </div>
    );
  }

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
