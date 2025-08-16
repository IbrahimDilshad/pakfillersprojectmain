'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AdminConfigPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "System Configuration", ur: "سسٹم کنفیگریشن" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Settings className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Admin: System Configuration", ur: "ایڈمن: سسٹم کنفیگریشن" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "Tools for system-wide configuration and settings will be located here. This section is under construction.", ur: "سسٹم وسیع کنفیگریشن اور سیٹنگز کے ٹولز یہاں موجود ہوں گے۔ یہ سیکشن زیر تعمیر ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
