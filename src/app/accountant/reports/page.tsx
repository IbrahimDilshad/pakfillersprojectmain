import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function AccountantReportsPage() {
  return (
    <AppLayout pageTitle="Generate Reports">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <BarChart className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Accountant: Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This area will provide powerful report generation tools for accountants. Development is in progress.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
