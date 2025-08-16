import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ArrowRight, LayoutDashboard, FileSignature, FileUp, User, CreditCard } from "lucide-react"

const forms = [
  { id: 'income-tax-return', title: 'Income Tax Return', icon: FileText },
  { id: 'sales-tax-return', title: 'Sales Tax Return', icon: FileText },
  { id: 'wealth-statement', title: 'Wealth Statement', icon: FileText },
  { id: 'withholding-tax-statement', title: 'Withholding Tax', icon: FileText },
  { href: "/filing", title: "Tax Filing", icon: FileSignature },
  { href: "/documents", title: "Documents", icon: FileUp },
  { href: "/profile", title: "IRIS Profile", icon: User },
  { href: "/services", title: "Service Charges", icon: CreditCard },
];

export default function DashboardPage() {
  return (
    <AppLayout pageTitle="Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 text-center">
        {forms.map((form) => (
          <Link href={form.id ? `/forms/${form.id}` : form.href!} key={form.id || form.href} className="block hover:bg-accent/50 hover:shadow-lg transition-all rounded-lg">
            <Card className="cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className="bg-primary/10 text-primary p-4 rounded-full mb-2">
                    <form.icon className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium text-foreground">{form.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
