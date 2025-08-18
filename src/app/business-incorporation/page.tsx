
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Users, PlusCircle, MinusCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const options = [
  {
    icon: User,
    title: { en: "Sole Proprietor", ur: "واحد ملکیت" },
    description: { en: "Register a business owned by a single individual.", ur: "ایک فرد کی ملکیت والے کاروبار کو رجسٹر کریں۔" },
    href: "#",
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
          <div className="grid md:grid-cols-2 gap-6">
            {options.map((option) => (
              <Card key={t(option.title)} className="hover:shadow-md transition-shadow">
                <Link href={option.href}>
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <option.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{t(option.title)}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-2">{t(option.description)}</p>
                    <Button variant="link" className="p-0 mt-4">
                        {t({ en: "Proceed", ur: "آگے بڑھیں" })} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
