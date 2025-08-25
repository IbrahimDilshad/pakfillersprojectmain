"use client";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { LanguageProvider } from "@/context/language-context";
import { QueryProvider } from "@/lib/query-provider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <QueryProvider>
              <LanguageProvider>
                <CartProvider>
                    {children}
                </CartProvider>
              </LanguageProvider>
            </QueryProvider>
        </AuthProvider>
    )
}
