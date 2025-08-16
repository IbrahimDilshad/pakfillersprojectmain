'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCog } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AdminContentPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Content Management", ur: "مواد کا انتظام" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileCog className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Admin: Content Management", ur: "ایڈمن: مواد کا انتظام" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "A system for managing site content, such as FAQs and guidelines, will be available here for administrators. This feature is in progress.", ur: "سائٹ کے مواد، جیسے کہ عمومی سوالات اور رہنما خطوط، کے انتظام کا نظام یہاں منتظمین کے لیے دستیاب ہوگا۔ یہ فیچر جاری ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
