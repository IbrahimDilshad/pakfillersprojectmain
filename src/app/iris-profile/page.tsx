
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function IrisProfilePage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "IRIS Profile", ur: "IRIS پروفائل" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <User className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "IRIS Profile", ur: "IRIS پروفائل" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "The workflow to view and update your IRIS profile will be available here. This feature is under construction.", ur: "آپ کے IRIS پروفائل کو دیکھنے اور اپ ڈیٹ کرنے کا ورک فلو یہاں دستیاب ہوگا۔ یہ فیچر زیر تعمیر ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

    