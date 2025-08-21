
'use client';
import { AppLayout } from "@/components/app-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import { Settings, User, BadgeCheck } from "lucide-react";
import { ManageAccounts } from "@/components/manage-accounts";
import { useAuth, AuthUser } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PersonalInfoTab } from "@/components/personal-info-tab";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaymentHistoryTab } from "@/components/payment-history-tab";

const PlaceholderContent = ({ title, description }: { title: string, description: string }) => (
    <div className="p-8 text-center text-muted-foreground">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p>{description}</p>
    </div>
);

function NtnRegistrationTab() {
    const { t } = useLanguage();
    return (
        <div className="p-6">
            <h3 className="text-lg font-medium mb-4">{t({ en: "FBR Credentials", ur: "ایف بی آر کی اسناد" })}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t({ en: "Please provide your FBR IRIS credentials. This allows our team to access your profile for filing purposes.", ur: "براہ کرم اپنی ایف بی آر آئرس کی اسناد فراہم کریں۔ یہ ہماری ٹیم کو فائلنگ کے مقاصد کے لیے آپ کے پروفائل تک رسائی کی اجازت دیتا ہے۔" })}</p>
             <form className="space-y-6 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="fbr-pin">{t({ en: 'FBR PIN', ur: 'ایف بی آر پن' })}</Label>
                    <Input id="fbr-pin" type="password" placeholder="••••" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fbr-password">{t({ en: 'FBR Password', ur: 'ایف بی آر پاس ورڈ' })}</Label>
                    <Input id="fbr-password" type="password" placeholder="••••••••" />
                </div>
                 <div className="flex justify-end">
                    <Button>{t({ en: "Save Credentials", ur: "اسناد محفوظ کریں" })}</Button>
                </div>
            </form>
        </div>
    );
}

function AccountsTabContent() {
    const { t } = useLanguage();
    const { user, subAccounts } = useAuth();
    
    const allAccounts: AuthUser[] = user ? [user, ...subAccounts] : [...subAccounts];

    return (
        <div className="p-6">
            <h3 className="text-lg font-medium mb-4">{t({ en: "Your Accounts", ur: "آپ کے اکاؤنٹس" })}</h3>
            <div className="grid gap-4">
                 {allAccounts.map(account => (
                     <Card key={account.uid} className="flex items-center p-4 gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback>{account.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{account.displayName}</h4>
                                {!account.isSubAccount && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <BadgeCheck className="h-3.5 w-3.5 text-primary"/>
                                        {t({ en: "Primary", ur: "بنیادی" })}
                                    </Badge>
                                )}
                                {account.accountType && (
                                     <Badge variant="outline">
                                        {t({ en: account.accountType, ur: account.accountType === 'family' ? 'فیملی' : 'کاروبار' })}
                                     </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{account.email}</p>
                        </div>
                    </Card>
                 ))}

                {allAccounts.length === 0 && (
                     <div className="text-center text-muted-foreground py-8">
                        <p>{t({ en: "No accounts found.", ur: "کوئی اکاؤنٹس نہیں ملے۔" })}</p>
                    </div>
                )}
            </div>
        </div>
    );
}


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
            <TabsList className="grid w-full grid-cols-5 h-auto">
                <TabsTrigger value="personal-info">{t({ en: "Personal Info", ur: "ذاتی معلومات" })}</TabsTrigger>
                <TabsTrigger value="ntn-registration">{t({ en: "NTN Registration", ur: "NTN رجسٹریشن" })}</TabsTrigger>
                <TabsTrigger value="payment-history">{t({ en: "Payment History", ur: "ادائیگی کی تاریخ" })}</TabsTrigger>
                <TabsTrigger value="manage-accounts">{t({ en: "Manage Accounts", ur: "اکاؤنٹس کا نظم کریں" })}</TabsTrigger>
                <TabsTrigger value="accounts">{t({ en: "Accounts", ur: "اکاؤنٹس" })}</TabsTrigger>
            </TabsList>
            <Card className="mt-4">
              <CardContent className="p-0">
                  <TabsContent value="personal-info">
                    <PersonalInfoTab />
                  </TabsContent>
                  <TabsContent value="ntn-registration">
                     <NtnRegistrationTab />
                  </TabsContent>
                   <TabsContent value="payment-history">
                     <PaymentHistoryTab />
                  </TabsContent>
                  <TabsContent value="manage-accounts">
                    <ManageAccounts />
                  </TabsContent>
                   <TabsContent value="accounts">
                     <AccountsTabContent />
                  </TabsContent>
              </CardContent>
            </Card>
        </Tabs>
      </div>
    </AppLayout>
  );
}
