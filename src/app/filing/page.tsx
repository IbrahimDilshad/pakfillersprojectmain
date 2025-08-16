'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSignature } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function FilingPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Tax Filing", ur: "ٹیکس فائلنگ" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileSignature className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Tax Filing Coming Soon", ur: "ٹیکس فائلنگ جلد آرہی ہے۔" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "Our streamlined tax filing workflow is currently under development. Soon you'll be able to file your personal and family taxes right from here.", ur: "ہمارا ہموار ٹیکس فائلنگ ورک فلو فی الحال زیر تعمیر ہے۔ جلد ہی آپ یہاں سے اپنے ذاتی اور خاندانی ٹیکس فائل کر سکیں گے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
