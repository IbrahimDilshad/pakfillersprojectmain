
'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <AppLayout pageTitle={t({ en: "Profile", ur: "پروفائل" })}>
      <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>{t({en: "Personal Information", ur: "ذاتی معلومات"})}</CardTitle>
                <CardDescription>{t({en: "View your personal details here.", ur: "اپنی ذاتی تفصیلات یہاں دیکھیں۔"})}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">{t({ en: "Full Name", ur: "پورا نام" })}</Label>
                        <Input id="fullName" value={user?.displayName || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t({ en: "Email", ur: "ای میل" })}</Label>
                        <Input id="email" type="email" value={user?.email || ''} readOnly />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
