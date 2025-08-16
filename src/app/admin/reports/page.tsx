'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AdminReportsPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Reports Generation", ur: "رپورٹس جنریشن" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <BarChart className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Admin: Reports Generation", ur: "ایڈمن: رپورٹس جنریشن" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "The administrative interface for generating system-level reports is being developed and will be available here.", ur: "سسٹم سطح کی رپورٹیں بنانے کے لیے انتظامی انٹرفیس تیار کیا جا رہا ہے اور یہاں دستیاب ہوگا۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
