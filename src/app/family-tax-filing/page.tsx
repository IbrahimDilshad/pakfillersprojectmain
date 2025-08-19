
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import { Settings } from "lucide-react";
import { ManageAccounts } from "@/components/manage-accounts";

const PlaceholderContent = ({ title, description }: { title: string, description: string }) => (
    <div className="p-8 text-center text-muted-foreground">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p>{description}</p>
    </div>
);


export default function FamilyTaxFilingPage() {
  const { t } = useLanguage();

  return (
    <AppLayout pageTitle={t({ en: "Account Settings", ur: "اکاؤنٹ کی ترتیبات" })}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <Settings className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t({ en: "Account Settings", ur: "اکاؤنٹ کی ترتیبات" })}</h1>
            <p className="text-muted-foreground">{t({ en: "Manage your profile, linked accounts, and security.", ur: "اپنے پروفائل، منسلک اکاؤنٹس، اور سیکیورٹی کا نظم کریں۔" })}</p>
          </div>
        </div>
        <Tabs defaultValue="manage-accounts" className="w-full">
            <TabsList className="grid w-full grid-cols-7 h-auto">
                <TabsTrigger value="personal-info">{t({ en: "Personal Info", ur: "ذاتی معلومات" })}</TabsTrigger>
                <TabsTrigger value="ntn-registration">{t({ en: "NTN Registration", ur: "NTN رجسٹریشن" })}</TabsTrigger>
                <TabsTrigger value="change-password">{t({ en: "Change Password", ur: "پاس ورڈ تبدیل کریں" })}</TabsTrigger>
                <TabsTrigger value="agent">{t({ en: "Agent", ur: "ایجنٹ" })}</TabsTrigger>
                <TabsTrigger value="payment-history">{t({ en: "Payment History", ur: "ادائیگی کی تاریخ" })}</TabsTrigger>
                <TabsTrigger value="manage-accounts">{t({ en: "Manage Accounts", ur: "اکاؤنٹس کا نظم کریں" })}</TabsTrigger>
                <TabsTrigger value="accounts">{t({ en: "Accounts", ur: "اکاؤنٹس" })}</TabsTrigger>
            </TabsList>
            <Card className="mt-4">
              <CardContent className="p-0">
                  <TabsContent value="personal-info">
                    <PlaceholderContent title="Personal Info" description="This section is under construction." />
                  </TabsContent>
                  <TabsContent value="ntn-registration">
                     <PlaceholderContent title="NTN Registration" description="This section is under construction." />
                  </TabsContent>
                   <TabsContent value="change-password">
                     <PlaceholderContent title="Change Password" description="This section is under construction." />
                  </TabsContent>
                   <TabsContent value="agent">
                     <PlaceholderContent title="Agent" description="This section is under construction." />
                  </TabsContent>
                   <TabsContent value="payment-history">
                     <PlaceholderContent title="Payment History" description="This section is under construction." />
                  </TabsContent>
                  <TabsContent value="manage-accounts">
                    <ManageAccounts />
                  </TabsContent>
                   <TabsContent value="accounts">
                     <PlaceholderContent title="Accounts" description="This section will display your linked accounts." />
                  </TabsContent>
              </CardContent>
            </Card>
        </Tabs>
      </div>
    </AppLayout>
  );
}
