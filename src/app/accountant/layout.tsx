
'use client';
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { AccountantSidebar } from "@/components/accountant/accountant-sidebar";
import { Header } from "@/components/header";

export default function AccountantLayout({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'accountant') {
                router.push('/login');
            }
        }
    }, [user, loading, router]);
    
    if (loading || !user || user.role !== 'accountant') {
        return <div className="flex h-screen w-full items-center justify-center">Loading Accountant Panel...</div>;
    }

    return (
        <div className="flex min-h-screen">
            <AccountantSidebar />
            <div className="flex flex-col flex-1">
                 <Header title="Accountant Panel" />
                 <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                 </main>
            </div>
        </div>
    );
}
