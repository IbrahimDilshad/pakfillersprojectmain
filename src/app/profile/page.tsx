'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ProfilePage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "IRIS Profile", ur: "IRIS پروفائل" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <User className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "View/Update IRIS Profile Coming Soon", ur: "IRIS پروفائل دیکھیں/اپ ڈیٹ کریں جلد آرہا ہے۔" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "Soon you will be able to view and update your IRIS profile information directly from PakFiler, keeping your details up-to-date effortlessly.", ur: "جلد ہی آپ پاک فائلر سے براہ راست اپنے IRIS پروفائل کی معلومات دیکھ اور اپ ڈیٹ کر سکیں گے، اپنی تفصیلات کو آسانی سے اپ ٹو ڈیٹ رکھتے ہوئے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
