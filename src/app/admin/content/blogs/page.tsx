
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function AdminContentBlogsPage() {
    const { t } = useLanguage();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "Manage Blog Posts", ur: "بلاگ پوسٹس کا نظم کریں" })}</CardTitle>
                <CardDescription>{t({ en: "This page is under construction. You will be able to create and manage blog posts here.", ur: "یہ صفحہ زیر تعمیر ہے۔ آپ یہاں بلاگ پوسٹس بنا اور ان کا نظم کر سکیں گے۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-16">{t({ en: "Coming Soon", ur: "جلد آرہا ہے۔" })}</p>
            </CardContent>
        </Card>
    );
}
