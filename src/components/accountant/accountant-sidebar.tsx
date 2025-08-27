
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart, FileSignature, Files } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Logo } from "../logo";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/accountant", label: { en: "Dashboard", ur: "ڈیش بورڈ" }, icon: Home },
    { href: "/accountant/review", label: { en: "Document Review", ur: "دستاویز کا جائزہ" }, icon: Files },
    { href: "/accountant/process", label: { en: "Process Filings", ur: "فائلنگ پر کارروائی کریں" }, icon: FileSignature },
    { href: "/accountant/reports", label: { en: "Reports", ur: "رپورٹس" }, icon: BarChart },
];

export function AccountantSidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <aside className="w-64 flex-shrink-0 bg-muted/40 border-r hidden md:block">
            <div className="flex flex-col h-full">
                 <div className="flex h-16 items-center px-6 border-b">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <Logo className="h-6 w-6 text-primary" />
                        <span>{t({ en: "PakFiler Accountant", ur: "پاک فائلر اکاؤنٹنٹ" })}</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href!}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                                        pathname === item.href && "bg-primary/10 text-primary font-semibold"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {t(item.label)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
