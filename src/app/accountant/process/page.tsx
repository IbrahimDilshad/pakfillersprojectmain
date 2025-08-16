import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function ProcessPage() {
  return (
    <AppLayout pageTitle="Process Filings">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Briefcase className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Accountant: Process Tax Filings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The workflow for accountants to process client tax filings will be available here. This feature is under construction.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
