
'use client';
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Header } from "@/components/header";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                router.push('/login');
            }
        }
    }, [user, loading, router]);
    
    if (loading || !user || user.role !== 'admin') {
        return <div className="flex h-screen w-full items-center justify-center">Loading Admin Panel...</div>;
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex flex-col flex-1">
                 <Header title="Admin Panel" />
                 <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                 </main>
            </div>
        </div>
    );
}
