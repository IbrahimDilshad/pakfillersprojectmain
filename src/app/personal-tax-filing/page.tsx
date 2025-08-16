'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSignature } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function PersonalTaxFilingPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Personal Tax Filing", ur: "ذاتی ٹیکس فائلنگ" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileSignature className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Personal Tax Filing", ur: "ذاتی ٹیکس فائلنگ" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "The workflow for personal tax filing will be available here. This feature is under construction.", ur: "ذاتی ٹیکس فائلنگ کا ورک فلو یہاں دستیاب ہوگا۔ یہ فیچر زیر تعمیر ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
