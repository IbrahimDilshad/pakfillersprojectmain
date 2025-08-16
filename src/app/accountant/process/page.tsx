'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ProcessPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Process Filings", ur: "فائلنگ پر کارروائی کریں" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Briefcase className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Accountant: Process Tax Filings", ur: "اکاؤنٹنٹ: ٹیکس فائلنگ پر کارروائی کریں" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "The workflow for accountants to process client tax filings will be available here. This feature is under construction.", ur: "اکاؤنٹنٹس کے لیے کلائنٹ ٹیکس فائلنگ پر کارروائی کا ورک فلو یہاں دستیاب ہوگا۔ یہ فیچر زیر تعمیر ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
