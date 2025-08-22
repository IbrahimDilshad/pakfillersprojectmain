
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Info } from "lucide-react";

export default function AdminPricingPage() {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t({ en: "Manage Form Pricing", ur: "فارم کی قیمتوں کا نظم کریں" })}</CardTitle>
        <CardDescription>{t({ en: "This section has been moved.", ur: "یہ سیکشن منتقل کر دیا گیا ہے۔" })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-10 flex flex-col items-center justify-center bg-muted/50 rounded-lg text-center">
            <Info className="h-12 w-12 text-primary mb-4"/>
            <p className="text-lg font-medium text-foreground">
                {t({en: "Pricing is now managed under the 'Content' tab.", ur: "قیمتوں کا تعین اب 'مواد' ٹیب کے تحت کیا جاتا ہے۔"})}
            </p>
            <p className="text-muted-foreground mt-2">
                {t({en: "To set prices for forms, please go to the 'Content' page and select the 'Form Pricing' tab.", ur: "فارموں کی قیمتیں مقرر کرنے کے لیے، براہ کرم 'مواد' کے صفحہ پر جائیں اور 'فارم کی قیمتیں' ٹیب کو منتخب کریں۔"})}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
