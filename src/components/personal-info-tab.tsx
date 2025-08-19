
'use client';
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function PersonalInfoTab() {
    const { t } = useLanguage();
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h3 className="text-lg font-medium mb-4">{t({ en: "Your Personal Information", ur: "آپ کی ذاتی معلومات" })}</h3>
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">{t({ en: "Full Name", ur: "پورا نام" })}</Label>
                        <Input id="fullName" value={user?.displayName || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t({ en: "Email", ur: "ای میل" })}</Label>
                        <Input id="email" type="email" value={user?.email || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cnic">{t({ en: "CNIC", ur: "شناختی کارڈ نمبر" })}</Label>
                        <Input id="cnic" value={user?.cnic || ''} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="mobile">{t({ en: "Mobile Number", ur: "موبائل نمبر" })}</Label>
                        <Input id="mobile" type="tel" value={user?.mobileNumber || ''} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="accountType">{t({ en: "Account Type", ur: "اکاؤنٹ کی قسم" })}</Label>
                        <div>
                             <Badge variant="secondary">{t({ en: "Primary Account", ur: "بنیادی اکاؤنٹ" })}</Badge>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
}
