'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ServicesPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Service Charges", ur: "سروس چارجز" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <CreditCard className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Service Charges Overview Coming Soon", ur: "سروس چارجز کا جائزہ جلد آرہا ہے۔" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "We believe in transparency. A detailed overview of our service charges will be available here soon.", ur: "ہم شفافیت پر یقین رکھتے ہیں۔ ہماری سروس چارجز کا تفصیلی جائزہ جلد ہی یہاں دستیاب ہوگا۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
