import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { QueryProvider } from '@/lib/query-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'PakFiler',
  description: 'Your trusted partner for tax filing in Pakistan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
            <QueryProvider>
              <LanguageProvider>
                <CartProvider>
                    {children}
                    <Toaster />
                </CartProvider>
              </LanguageProvider>
            </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
