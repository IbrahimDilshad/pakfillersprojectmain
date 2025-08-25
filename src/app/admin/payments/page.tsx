
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function AdminPaymentsPage() {
    const { t } = useLanguage();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "Payment Settings", ur: "ادائیگی کی ترتیبات" })}</CardTitle>
                <CardDescription>{t({ en: "This page is under construction. You will be able to manage bank accounts and other payment settings here.", ur: "یہ صفحہ زیر تعمیر ہے۔ آپ یہاں بینک اکاؤنٹس اور دیگر ادائیگی کی ترتیبات کا نظم کر سکیں گے۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-16">{t({ en: "Coming Soon", ur: "جلد آرہا ہے۔" })}</p>
            </CardContent>
        </Card>
    );
}
