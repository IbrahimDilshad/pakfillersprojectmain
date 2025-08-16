import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight } from "lucide-react"

const forms = [
  { id: 'income-tax-return', title: 'Income Tax Return', description: 'For salaried individuals and sole proprietors.' },
  { id: 'sales-tax-return', title: 'Sales Tax Return', description: 'Monthly return for registered businesses.' },
  { id: 'wealth-statement', title: 'Wealth Statement', description: 'Statement of assets and liabilities.' },
  { id: 'withholding-tax-statement', title: 'Withholding Tax', description: 'Quarterly statement for withholding agents.' },
];

export default function DashboardPage() {
  return (
    <AppLayout pageTitle="Form Library">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-accent/50 text-accent-foreground p-3 rounded-md">
                    <FileText className="h-6 w-6" />
                </div>
                <CardTitle>{form.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">{form.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={`/forms/${form.id}`} className="w-full" passHref>
                <Button className="w-full">
                  Open Form <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppLayout>
  )
}
