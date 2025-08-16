'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ReviewPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Review Documents", ur: "دستاویزات کا جائزہ لیں" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileSearch className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Accountant: Document Review", ur: "اکاؤنٹنٹ: دستاویز کا جائزہ" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "This section is for accountants to review and approve user-submitted documents. This feature is currently under development.", ur: "یہ سیکشن اکاؤنٹنٹس کے لیے صارف کی جمع کردہ دستاویزات کا جائزہ لینے اور انہیں منظور کرنے کے لیے ہے۔ یہ فیچر اس وقت زیر ترقی ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
