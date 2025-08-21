
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Info } from "lucide-react";

export default function AdminPricingPage() {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t({ en: "Manage Form & Service Pricing", ur: "فارم اور سروس کی قیمتوں کا نظم کریں" })}</CardTitle>
        <CardDescription>{t({ en: "All services now have a standardized price of PKR 3000.", ur: "تمام خدمات کی قیمت اب 3000 پاکستانی روپے مقرر ہے۔" })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-10 flex flex-col items-center justify-center bg-muted/50 rounded-lg text-center">
            <Info className="h-12 w-12 text-primary mb-4"/>
            <p className="text-lg font-medium text-foreground">
                {t({en: "Pricing is now managed within the service details.", ur: "قیمتوں کا تعین اب سروس کی تفصیلات میں کیا جاتا ہے۔"})}
            </p>
            <p className="text-muted-foreground mt-2">
                {t({en: "To add, edit, or remove services, please go to the 'Content' management page. All services are automatically assigned a price of PKR 3000.", ur: "خدمات شامل کرنے، ترمیم کرنے یا ہٹانے کے لیے، براہ کرم 'مواد' کے انتظامی صفحہ پر جائیں۔ تمام خدمات کو خود بخود 3000 پاکستانی روپے کی قیمت تفویض کی جاتی ہے۔"})}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
