
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function AdminReportsPage() {
    const { t } = useLanguage();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "Reports", ur: "رپورٹس" })}</CardTitle>
                <CardDescription>{t({ en: "This page is under construction. You will be able to generate various reports from here.", ur: "یہ صفحہ زیر تعمیر ہے۔ آپ یہاں سے مختلف رپورٹس بنا سکیں گے۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-center text-muted-foreground py-16">{t({ en: "Coming Soon", ur: "جلد آرہا ہے۔" })}</p>
            </CardContent>
        </Card>
    );
}
