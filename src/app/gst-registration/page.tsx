
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function GstRegistrationPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "GST Registration", ur: "جی ایس ٹی رجسٹریشن" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Landmark className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "GST Registration", ur: "جی ایس ٹی رجسٹریشن" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "The workflow for GST registration will be available here. This feature is under construction.", ur: "جی ایس ٹی رجسٹریشن کا ورک فلو یہاں دستیاب ہوگا۔ یہ فیچر زیر تعمیر ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

    