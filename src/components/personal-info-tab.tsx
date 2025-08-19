
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

export function PersonalInfoTab() {
    const { t } = useLanguage();
    const { user, setUser } = useAuth();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [cnic, setCnic] = useState(user?.cnic || '');
    const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setEmail(user.email || '');
            setCnic(user.cnic || '');
            setMobileNumber(user.mobileNumber || '');
        }
    }, [user]);

    const handleSaveChanges = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const userDocRef = doc(db, "users", user.uid);
            const updatedData = {
                displayName,
                cnic,
                mobileNumber,
            };
            
            // Note: Email updates require special handling (re-authentication) and are disabled for now.
            await updateDoc(userDocRef, updatedData);
            
            if (auth.currentUser && auth.currentUser.displayName !== displayName) {
                 await updateProfile(auth.currentUser, { displayName });
            }

            // Update local context state
            setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);

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
                        <Input id="email" type="email" value={email} readOnly disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cnic">{t({ en: "CNIC", ur: "شناختی کارڈ نمبر" })}</Label>
                        <Input id="cnic" value={cnic} onChange={(e) => setCnic(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="mobile">{t({ en: "Mobile Number", ur: "موبائل نمبر" })}</Label>
                        <Input id="mobile" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="accountType">{t({ en: "Account Type", ur: "اکاؤنٹ کی قسم" })}</Label>
                        <div>
                             <Badge variant="secondary">{t({ en: "Primary Account", ur: "بنیادی اکاؤنٹ" })}</Badge>
                        </div>
                    </div>
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
