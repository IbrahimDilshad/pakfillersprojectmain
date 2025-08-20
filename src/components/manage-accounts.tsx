
'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function AddAccountForm() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { user: loggedInUser } = useAuth();
    const [accountType, setAccountType] = useState<'business' | 'family' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedInUser || !accountType) return;

        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        const subAccountData = {
            displayName: data.accountName as string,
            email: data.email as string,
            cnic: data.cnic as string,
            mobileNumber: data.mobile as string,
            accountType: accountType,
            relation: data.relation as string || null,
            legalStructure: data.legalStructure as string || null,
            parentUid: loggedInUser.uid,
            createdAt: serverTimestamp(),
            role: 'user'
        };

        try {
            const subAccountsCollectionRef = collection(db, `users/${loggedInUser.uid}/subAccounts`);
            await addDoc(subAccountsCollectionRef, subAccountData);

            toast({
                title: t({ en: "Account Saved", ur: "اکاؤنٹ محفوظ ہو گیا" }),
                description: t({ en: "The new account can be switched to from the profile menu.", ur: "نیا اکاؤنٹ پروفائل مینو سے تبدیل کیا جا سکتا ہے۔" })
            });
            // Reset form if needed
            (e.target as HTMLFormElement).reset();
            setAccountType(null);
        } catch (error) {
            console.error("Error creating sub-account: ", error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to create sub-account." });
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-lg font-medium mb-4">{t({ en: "Select Account Type", ur: "اکاؤنٹ کی قسم منتخب کریں" })}</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
                 <Button variant={accountType === 'business' ? 'default' : 'outline'} onClick={() => setAccountType('business')}>
                    {t({ en: "Business Account", ur: "کاروباری اکاؤنٹ" })}
                </Button>
                <Button variant={accountType === 'family' ? 'default' : 'outline'} onClick={() => setAccountType('family')}>
                    {t({ en: "Family Account", ur: "فیملی اکاؤنٹ" })}
                </Button>
            </div>

            {accountType && (
                 <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="accountName">{t({ en: "Account Name", ur: "اکاؤنٹ کا نام" })}</Label>
                            <Input name="accountName" id="accountName" placeholder={t({ en: "e.g., John Doe", ur: "مثلاً جان ڈو" })} required />
                        </div>
                        {accountType === 'family' ? (
                            <div className="space-y-2">
                                <Label htmlFor="relation">{t({ en: "Relation", ur: "رشتہ" })}</Label>
                                <Select name="relation" required>
                                    <SelectTrigger id="relation">
                                        <SelectValue placeholder={t({ en: "Select relation", ur: "رشتہ منتخب کریں" })} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="parent">{t({ en: "Parent", ur: "والدین" })}</SelectItem>
                                        <SelectItem value="sibling">{t({ en: "Sibling", ur: "بہن بھائی" })}</SelectItem>
                                        <SelectItem value="child">{t({ en: "Child", ur: "بچہ" })}</SelectItem>
                                        <SelectItem value="spouse">{t({ en: "Spouse", ur: "شریک حیات" })}</SelectItem>
                                        <SelectItem value="other">{t({ en: "Other", ur: "دیگر" })}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                             <div className="space-y-2">
                                <Label htmlFor="legalStructure">{t({ en: "Legal Structure", ur: "قانونی ڈھانچہ" })}</Label>
                                <Select name="legalStructure" required>
                                    <SelectTrigger id="legal-structure">
                                        <SelectValue placeholder={t({ en: "Select legal structure", ur: "قانونی ڈھانچہ منتخب کریں" })} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="company">{t({ en: "Company/NPO", ur: "کمپنی/این پی او" })}</SelectItem>
                                        <SelectItem value="aop">{t({ en: "AOP/Partnership", ur: "اے او پی/شراکت داری" })}</SelectItem>
                                        <SelectItem value="individual">{t({ en: "Individual/Sole Proprietor", ur: "انفرادی/واحد ملکیت" })}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="cnic">{t({ en: "CNIC Number", ur: "شناختی کارڈ نمبر" })}</Label>
                            <Input name="cnic" id="cnic" placeholder="12345-1234567-1" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">{t({ en: "Email", ur: "ای میل" })}</Label>
                            <Input name="email" id="email" type="email" placeholder="user@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">{t({ en: "Mobile Number", ur: "موبائل نمبر" })}</Label>
                            <Input name="mobile" id="mobile" type="tel" placeholder="03001234567" required />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">{t({ en: "Submit", ur: "جمع کرائیں" })}</Button>
                    </div>
                </form>
            )}
        </div>
    )
}

function TagAccountForm() {
    const { t } = useLanguage();
    const [userType, setUserType] = useState('');

    return (
        <div className="p-6">
             <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="tag-email">{t({ en: "Account Email", ur: "اکاؤنٹ ای میل" })}</Label>
                        <Input id="tag-email" type="email" placeholder="user@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="user-type">{t({ en: "User Type", ur: "صارف کی قسم" })}</Label>
                        <Select onValueChange={setUserType} required>
                            <SelectTrigger id="user-type">
                                <SelectValue placeholder={t({ en: "Select user type", ur: "صارف کی قسم منتخب کریں" })} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="business">{t({ en: "Business Account", ur: "کاروباری اکاؤنٹ" })}</SelectItem>
                                <SelectItem value="family">{t({ en: "Family Account", ur: "فیملی اکاؤنٹ" })}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {userType === 'business' && (
                        <div className="space-y-2 md:col-span-2 animate-in fade-in-50">
                            <Label htmlFor="legal-structure">{t({ en: "Legal Structure", ur: "قانونی ڈھانچہ" })}</Label>
                            <Select required>
                                <SelectTrigger id="legal-structure">
                                    <SelectValue placeholder={t({ en: "Select legal structure", ur: "قانونی ڈھانچہ منتخب کریں" })} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="company">{t({ en: "Company/NPO", ur: "کمپنی/این پی او" })}</SelectItem>
                                    <SelectItem value="aop">{t({ en: "AOP/Partnership", ur: "اے او پی/شراکت داری" })}</SelectItem>
                                    <SelectItem value="individual">{t({ en: "Individual/Sole Proprietor", ur: "انفرادی/واحد ملکیت" })}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {userType === 'family' && (
                        <div className="space-y-2 md:col-span-2 animate-in fade-in-50">
                            <Label htmlFor="tag-relation">{t({ en: "Relation", ur: "رشتہ" })}</Label>
                            <Select required>
                                <SelectTrigger id="tag-relation">
                                    <SelectValue placeholder={t({ en: "Select relation", ur: "رشتہ منتخب کریں" })} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="parent">{t({ en: "Parent", ur: "والدین" })}</SelectItem>
                                    <SelectItem value="sibling">{t({ en: "Sibling", ur: "بہن بھائی" })}</SelectItem>
                                    <SelectItem value="child">{t({ en: "Child", ur: "بچہ" })}</SelectItem>
                                    <SelectItem value="spouse">{t({ en: "Spouse", ur: "شریک حیات" })}</SelectItem>
                                    <SelectItem value="other">{t({ en: "Other", ur: "دیگر" })}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                 <div className="flex justify-end pt-4">
                    <Button type="submit">{t({ en: "Continue", ur: "جاری رکھیں" })}</Button>
                </div>
            </form>
        </div>
    )
}


export function ManageAccounts() {
    const { t } = useLanguage();
    return (
        <Tabs defaultValue="add-account" className="w-full">
            <div className="p-6 border-b">
                 <TabsList>
                    <TabsTrigger value="add-account">{t({ en: "Add Account", ur: "اکاؤنٹ شامل کریں" })}</TabsTrigger>
                    <TabsTrigger value="tag-account">{t({ en: "Tag Account", ur: "اکاؤنٹ ٹیگ کریں" })}</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="add-account">
               <AddAccountForm />
            </TabsContent>
            <TabsContent value="tag-account">
                <TagAccountForm />
            </TabsContent>
        </Tabs>
    )
}
