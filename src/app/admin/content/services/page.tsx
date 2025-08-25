
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function AdminContentServicesPage() {
    const { t } = useLanguage();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "Manage Services", ur: "خدمات کا نظم کریں" })}</CardTitle>
                <CardDescription>{t({ en: "This page is under construction. You will be able to add, edit, and delete services from here.", ur: "یہ صفحہ زیر تعمیر ہے۔ آپ یہاں سے خدمات شامل، ترمیم اور حذف کر سکیں گے۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-16">{t({ en: "Coming Soon", ur: "جلد آرہا ہے۔" })}</p>
            </CardContent>
        </Card>
    );
}
