
'use client';
import { useState } from 'react';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from "@/context/language-context";
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BankAccount {
  id: number;
  bankName: string;
  iban: string;
}

export default function IrisProfilePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([{ id: 1, bankName: '', iban: '' }]);

  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, { id: Date.now(), bankName: '', iban: '' }]);
  };

  const removeBankAccount = (id: number) => {
    setBankAccounts(bankAccounts.filter(account => account.id !== id));
  };
  
  const handleBankAccountChange = (id: number, field: 'bankName' | 'iban', value: string) => {
    setBankAccounts(bankAccounts.map(account => 
      account.id === id ? { ...account, [field]: value } : account
    ));
  };

  const handleSubmit = () => {
    // In a real app, you would collect all form data and process it.
    toast({
      title: "Service Added to Cart",
      description: "IRIS Profile update service has been added to your cart.",
    });
    router.push('/cart');
  };

  return (
    <AppLayout pageTitle={t({ en: "IRIS Profile", ur: "IRIS پروفائل" })}>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: "Update Your IRIS Profile", ur: "اپنا IRIS پروفائل اپ ڈیٹ کریں" })}</CardTitle>
            <CardDescription>
              {t({
                en: "Keep your FBR IRIS profile information up-to-date.",
                ur: "اپنی ایف بی آر آئرس پروفائل کی معلومات کو اپ ڈیٹ رکھیں۔",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-medium">{t({en: "Contact Information", ur: "رابطے کی معلومات"})}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg">
                     <div className="space-y-2">
                        <Label htmlFor="email">{t({ en: "Email", ur: "ای میل" })}</Label>
                        <Input id="email" type="email" placeholder="m@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile">{t({ en: "Mobile Number", ur: "موبائل نمبر" })}</Label>
                        <Input id="mobile" type="tel" placeholder="+92 300 1234567" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">{t({ en: "Present Address", ur: "موجودہ پتہ" })}</Label>
                        <Textarea id="address" placeholder={t({ en: "Enter your full address", ur: "اپنا مکمل پتہ درج کریں"})} />
                    </div>
                </div>
            </div>

             <div className="space-y-6">
                <h3 className="text-lg font-medium">{t({en: "Credentials", ur: "اسناد"})}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg">
                     <div className="space-y-2">
                        <Label htmlFor="pin">{t({ en: "IRIS PIN", ur: "آئرس پن" })}</Label>
                        <Input id="pin" type="password" placeholder="••••" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">{t({ en: "IRIS Password", ur: "آئرس پاس ورڈ" })}</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{t({en: "Bank Accounts", ur: "بینک اکاؤنٹس"})}</h3>
                    <Button variant="outline" size="sm" onClick={addBankAccount}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t({en: "Add Bank", ur: "بینک شامل کریں"})}
                    </Button>
                </div>
                <div className="space-y-4 border p-4 rounded-lg">
                    {bankAccounts.map((account, index) => (
                        <div key={account.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-2 space-y-2">
                                 {index === 0 && <Label>{t({en: "Bank Name", ur: "بینک کا نام"})}</Label>}
                                <Input 
                                  placeholder={t({ en: "e.g., HBL", ur: "مثلاً ایچ بی ایل"})} 
                                  value={account.bankName}
                                  onChange={(e) => handleBankAccountChange(account.id, 'bankName', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                {index === 0 && <Label>{t({en: "IBAN", ur: "بین الاقوامی بینک اکاؤنٹ نمبر"})}</Label>}
                                <Input 
                                    placeholder="PKXX HABB 0000 0000 0000 0000"
                                    value={account.iban}
                                    onChange={(e) => handleBankAccountChange(account.id, 'iban', e.target.value)}
                                />
                            </div>
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => removeBankAccount(account.id)}
                                disabled={bankAccounts.length === 1}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleSubmit}>{t({en: "Save Profile & Add to Cart", ur: "پروفائل محفوظ کریں اور کارٹ میں شامل کریں"})}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
