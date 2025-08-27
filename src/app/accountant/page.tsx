
'use client';

import { useLanguage } from "@/context/language-context";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, BarChart, FileCheck, FileSignature, Files } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const data = [
  { name: 'Jan', total: 12 },
  { name: 'Feb', total: 21 },
  { name: 'Mar', total: 8 },
  { name: 'Apr', total: 16 },
  { name: 'May', total: 9 },
  { name: 'Jun', total: 17 },
];

const featureCards = [
    {
        title: { en: "Document Management", ur: "دستاویز کا انتظام" },
        description: { en: "Review, approve, or reject user-submitted documents.", ur: "صارف کی طرف سے جمع کردہ دستاویزات کا جائزہ لیں، منظور کریں یا مسترد کریں۔" },
        href: "/accountant/review",
        icon: Files
    },
    {
        title: { en: "Process Tax Filings", ur: "ٹیکس فائلنگ پر کارروائی کریں" },
        description: { en: "Manage and process the tax filing requests from all users.", ur: "تمام صارفین سے ٹیکس فائلنگ کی درخواستوں کا نظم و نسق کریں۔" },
        href: "/accountant/process",
        icon: FileSignature
    },
     {
        title: { en: "Generate Reports", ur: "رپورٹیں بنائیں" },
        description: { en: "Generate detailed financial and user activity reports.", ur: "تفصیلی مالیاتی اور صارف کی سرگرمی کی رپورٹیں بنائیں۔" },
        href: "/accountant/reports",
        icon: BarChart
    }
]

export default function AccountantDashboardPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{t({ en: "Accountant Dashboard", ur: "اکاؤنٹنٹ ڈیش بورڈ" })}</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t({ en: "Total Documents", ur: "کل دستاویزات" })}</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,254</div>
                         <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t({ en: "Total Tax Filings", ur: "کل ٹیکس فائلنگز" })}</CardTitle>
                        <FileSignature className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">342</div>
                         <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t({ en: "Total Service Charges", ur: "کل سروس چارجز" })}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">PKR 1,235,600</div>
                         <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featureCards.map(card => (
                    <Card key={card.href} className="flex flex-col">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <div className="bg-primary/10 text-primary p-3 rounded-md">
                                <card.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>{t(card.title)}</CardTitle>
                                <CardDescription>{t(card.description)}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow" />
                        <div className="p-6 pt-0">
                            <Button asChild className="w-full">
                                <Link href={card.href}>
                                    {t({en: "View Page", ur: "صفحہ دیکھیں"})} <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{t({ en: "Filings Overview", ur: "فائلنگ کا جائزہ" })}</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                     <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
