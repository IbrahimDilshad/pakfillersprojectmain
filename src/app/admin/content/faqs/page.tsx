
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function AdminContentFaqsPage() {
    const { t } = useLanguage();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "Manage FAQs", ur: "اکثر پوچھے گئے سوالات کا نظم کریں" })}</CardTitle>
                <CardDescription>{t({ en: "This page is under construction. You will be able to manage FAQs from here.", ur: "یہ صفحہ زیر تعمیر ہے۔ آپ یہاں سے اکثر پوچھے گئے سوالات کا نظم کر سکیں گے۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-16">{t({ en: "Coming Soon", ur: "جلد آرہا ہے۔" })}</p>
            </CardContent>
        </Card>
    );
}
