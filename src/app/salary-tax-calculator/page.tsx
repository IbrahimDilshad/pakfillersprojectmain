
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function SalaryTaxCalculatorPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Salary Tax Calculator", ur: "تنخواہ ٹیکس کیلکولیٹر" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Calculator className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Salary Tax Calculator", ur: "تنخواہ ٹیکس کیلکولیٹر" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "A salary tax calculator tool will be available here soon. This feature is under construction.", ur: "تنخواہ ٹیکس کیلکولیٹر کا ٹول جلد ہی یہاں دستیاب ہوگا۔ یہ فیچر زیر تعمیر ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

    