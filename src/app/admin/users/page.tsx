'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "User Management", ur: "صارف کا انتظام" })}>
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Users className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Admin: User Management", ur: "ایڈمن: صارف کا انتظام" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "The admin dashboard for managing users will be available here. This feature is currently in development.", ur: "صارفین کے انتظام کے لیے ایڈمن ڈیش بورڈ یہاں دستیاب ہوگا۔ یہ فیچر اس وقت زیر ترقی ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
