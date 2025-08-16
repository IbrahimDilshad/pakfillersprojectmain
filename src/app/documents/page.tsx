'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function DocumentsPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Documents", ur: "دستاویزات" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileUp className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Document Management Coming Soon", ur: "دستاویز کے انتظام جلد آرہا ہے۔" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "A secure place to upload and manage all your tax-related documents is on its way. Stay tuned for an easy-to-use document management system.", ur: "آپ کے تمام ٹیکس سے متعلق دستاویزات کو اپ لوڈ اور ان کا نظم کرنے کے لیے ایک محفوظ جگہ راستے میں ہے۔ استعمال میں آسان دستاویز کے انتظام کے نظام کے لیے دیکھتے رہیں۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
