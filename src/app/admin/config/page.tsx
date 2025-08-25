
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function AdminConfigPage() {
    const { t } = useLanguage();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "Site Configuration", ur: "سائٹ کنفیگریشن" })}</CardTitle>
                <CardDescription>{t({ en: "This page is under construction. You will be able to manage site-wide settings here.", ur: "یہ صفحہ زیر تعمیر ہے۔ آپ یہاں سائٹ بھر کی ترتیبات کا نظم کر سکیں گے۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-16">{t({ en: "Coming Soon", ur: "جلد آرہا ہے۔" })}</p>
            </CardContent>
        </Card>
    );
}
