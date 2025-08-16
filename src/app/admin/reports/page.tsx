import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <AppLayout pageTitle="Reports Generation">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <BarChart className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Admin: Reports Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The administrative interface for generating system-level reports is being developed and will be available here.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
