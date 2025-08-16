
'use client';
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ArrowRight, LayoutDashboard, FileSignature, FileUp, User, CreditCard } from "lucide-react"
import { useLanguage } from "@/context/language-context";

const forms = [
  { id: 'income-tax-return', title: { en: 'Income Tax Return', ur: 'انکم ٹیکس ریٹرن' }, icon: FileText },
  { id: 'sales-tax-return', title: { en: 'Sales Tax Return', ur: 'سیلز ٹیکس ریٹرن' }, icon: FileText },
  { id: 'wealth-statement', title: { en: 'Wealth Statement', ur: 'دولت کا بیان' }, icon: FileText },
  { id: 'withholding-tax-statement', title: { en: 'Withholding Tax', ur: 'ودہولڈنگ ٹیکس' }, icon: FileText },
  { href: "/filing", title: { en: "Tax Filing", ur: "ٹیکس فائلنگ" }, icon: FileSignature },
  { href: "/documents", title: { en: "Documents", ur: "دستاویزات" }, icon: FileUp },
  { href: "/profile", title: { en: "IRIS Profile", ur: "IRIS پروفائل" }, icon: User },
  { href: "/services", title: { en: "Service Charges", ur: "سروس چارجز" }, icon: CreditCard },
];

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Dashboard", ur: "ڈیش بورڈ" })}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 text-center">
        {forms.map((form) => (
          <Link href={form.id ? `/forms/${form.id}` : form.href!} key={form.id || form.href} className="block hover:bg-accent/50 hover:shadow-lg transition-all rounded-lg">
            <Card className="cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className="bg-primary/10 text-primary p-4 rounded-full mb-2">
                    <form.icon className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium text-foreground">{t(form.title)}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
