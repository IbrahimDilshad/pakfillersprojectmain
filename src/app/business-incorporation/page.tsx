
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Users, PlusCircle, MinusCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";

const options = [
  {
    icon: User,
    title: { en: "Sole Proprietor", ur: "واحد ملکیت" },
    description: { en: "Register a business owned by a single individual.", ur: "ایک فرد کی ملکیت والے کاروبار کو رجسٹر کریں۔" },
    href: "/business-incorporation/sole-proprietor",
  },
  {
    icon: Users,
    title: { en: "AOP/Partnership", ur: "اے او پی/شراکت داری" },
    description: { en: "For businesses owned by two or more persons.", ur: "دو یا زیادہ افراد کی ملکیت والے کاروباروں کے لیے۔" },
    href: "#",
  },
  {
    icon: PlusCircle,
    title: { en: "Add Business to NTN", ur: "این ٹی این میں کاروبار شامل کریں" },
    description: { en: "Link a new business to your existing NTN.", ur: "اپنے موجودہ این ٹی این سے نیا کاروبار منسلک کریں۔" },
    href: "#",
  },
    {
    icon: MinusCircle,
    title: { en: "Remove Business from NTN", ur: "این ٹی این سے کاروبار ہٹائیں" },
    description: { en: "De-register or close a business from your NTN.", ur: "اپنے این ٹی این سے کاروبار کو ڈی رجسٹر یا بند کریں۔" },
    href: "#",
  },
];

export default function BusinessIncorporationPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Business Incorporation", ur: "کاروبار کی شمولیت" })}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{t({ en: "Business Incorporation", ur: "کاروبار کی شمولیت" })}</CardTitle>
          <CardDescription>{t({ en: "Choose the type of registration you need.", ur: "اپنی ضرورت کے مطابق رجسٹریشن کی قسم کا انتخاب کریں۔" })}</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="max-w-lg mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {options.map((option) => (
                    <Link href={option.href} key={t(option.title)} className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="text-primary p-4 rounded-full mb-2">
                            <option.icon className="h-10 w-10" />
                        </div>
                        <span className="text-sm font-medium text-foreground text-center">{t(option.title)}</span>
                    </Link>
                ))}
              </div>
           </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
