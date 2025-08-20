
'use client';
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function PersonalInfoTab() {
    const { t } = useLanguage();
    const { user, activeUser, setUser, setActiveUser } = useAuth();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState(activeUser?.displayName || '');
    const [email, setEmail] = useState(activeUser?.email || '');
    const [cnic, setCnic] = useState(activeUser?.cnic || '');
    const [mobileNumber, setMobileNumber] = useState(activeUser?.mobileNumber || '');
    const [relation, setRelation] = useState(activeUser?.relation || '');
    const [legalStructure, setLegalStructure] = useState(activeUser?.legalStructure || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (activeUser) {
            setDisplayName(activeUser.displayName || '');
            setEmail(activeUser.email || '');
            setCnic(activeUser.cnic || '');
            setMobileNumber(activeUser.mobileNumber || '');
            setRelation(activeUser.relation || '');
            setLegalStructure(activeUser.legalStructure || '');
        }
    }, [activeUser]);

    const handleSaveChanges = async () => {
        if (!user || !activeUser) return;
        setIsSaving(true);
        
        try {
            let userDocRef;
            if (activeUser.isSubAccount) {
                userDocRef = doc(db, `users/${user.uid}/subAccounts`, activeUser.uid);
            } else {
                userDocRef = doc(db, "users", activeUser.uid);
            }

            const updatedData: any = {
                displayName,
                cnic,
                mobileNumber,
                email, // assuming email can be edited for sub-accounts but not main
            };

            if (activeUser?.accountType === 'family') {
                updatedData.relation = relation;
            }
            if (activeUser?.accountType === 'business') {
                updatedData.legalStructure = legalStructure;
            }
            
            await updateDoc(userDocRef, updatedData);
            
            if (!activeUser.isSubAccount && auth.currentUser && auth.currentUser.displayName !== displayName) {
                 await updateProfile(auth.currentUser, { displayName });
            }

            const finalUpdatedUser = { ...activeUser, ...updatedData };
            setActiveUser(finalUpdatedUser);

            if(activeUser.isSubAccount) {
                // To-Do: update subAccounts array in context
            } else {
                setUser(finalUpdatedUser);
            }

            toast({
                title: t({ en: "Profile Updated", ur: "پروفائل اپ ڈیٹ ہو گیا" }),
                description: t({ en: "Your information has been successfully saved.", ur: "آپ کی معلومات کامیابی سے محفوظ ہو گئی ہیں۔" }),
            });
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast({
                variant: "destructive",
                title: t({ en: "Update Failed", ur: "اپ ڈیٹ ناکام" }),
                description: t({ en: "There was an error saving your profile.", ur: "آپ کا پروفائل محفوظ کرنے میں ایک خامی تھی۔" }),
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-lg font-medium mb-4">{t({ en: "Your Personal Information", ur: "آپ کی ذاتی معلومات" })}</h3>
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">{t({ en: "Full Name", ur: "پورا نام" })}</Label>
                        <Input id="fullName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t({ en: "Email", ur: "ای میل" })}</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!activeUser?.isSubAccount} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cnic">{t({ en: "CNIC", ur: "شناختی کارڈ نمبر" })}</Label>
                        <Input id="cnic" value={cnic} onChange={(e) => setCnic(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="mobile">{t({ en: "Mobile Number", ur: "موبائل نمبر" })}</Label>
                        <Input id="mobile" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                    </div>

                    {activeUser?.accountType === 'family' && (
                        <div className="space-y-2">
                            <Label htmlFor="relation">{t({ en: "Relation", ur: "رشتہ" })}</Label>
                             <Select value={relation} onValueChange={setRelation}>
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
                    )}

                     {activeUser?.accountType === 'business' && (
                        <div className="space-y-2">
                            <Label htmlFor="legal-structure">{t({ en: "Legal Structure", ur: "قانونی ڈھانچہ" })}</Label>
                            <Select value={legalStructure} onValueChange={setLegalStructure}>
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

                    {!activeUser?.isSubAccount && (
                         <div className="space-y-2">
                            <Label htmlFor="accountType">{t({ en: "Account Type", ur: "اکاؤنٹ کی قسم" })}</Label>
                            <div>
                                <Badge variant="secondary">{t({ en: "Primary Account", ur: "بنیادی اکاؤنٹ" })}</Badge>
                            </div>
                        </div>
                    )}
                 </div>
                 <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? t({ en: 'Saving...', ur: 'محفوظ کیا جا رہا ہے...' }) : t({ en: "Save Changes", ur: "تبدیلیاں محفوظ کریں" })}
                    </Button>
                 </div>
            </div>
        </div>
    );
}
