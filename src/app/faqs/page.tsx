
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function FaqsPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "FAQs", ur: "اکثر پوچھے گئے سوالات" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileQuestion className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Frequently Asked Questions", ur: "اکثر پوچھے گئے سوالات" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "This page will contain answers to frequently asked questions. This feature is under construction.", ur: "اس صفحہ میں اکثر پوچھے جانے والے سوالات کے جوابات ہوں گے۔ یہ فیچر زیر تعمیر ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

    