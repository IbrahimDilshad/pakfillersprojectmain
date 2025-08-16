
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
                <CardDescription>{t({en: "Update your personal details here.", ur: "اپنی ذاتی تفصیلات یہاں اپ ڈیٹ کریں۔"})}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src="https://placehold.co/80x80.png" alt="@user" data-ai-hint="user avatar" />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <Button>{t({en: "Change Photo", ur: "تصویر تبدیل کریں"})}</Button>
                        <p className="text-xs text-muted-foreground mt-2">{t({en: "JPG, GIF or PNG. 1MB max.", ur: "JPG, GIF یا PNG۔ 1MB زیادہ سے زیادہ۔"})}</p>
                    </div>
                </div>

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

                 <div className="flex justify-end">
                    <Button disabled>{t({en: "Save Changes", ur: "تبدیلیاں محفوظ کریں"})}</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
