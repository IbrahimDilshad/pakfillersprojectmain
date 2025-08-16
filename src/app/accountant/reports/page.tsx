'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AccountantReportsPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Generate Reports", ur: "رپورٹیں بنائیں" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <BarChart className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Accountant: Generate Reports", ur: "اکاؤنٹنٹ: رپورٹیں بنائیں" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "This area will provide powerful report generation tools for accountants. Development is in progress.", ur: "یہ علاقہ اکاؤنٹنٹس کے لیے طاقتور رپورٹ جنریشن ٹولز فراہم کرے گا۔ ترقی جاری ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
