import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function ServicesPage() {
  return (
    <AppLayout pageTitle="Service Charges">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <CreditCard className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Service Charges Overview Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We believe in transparency. A detailed overview of our service charges will be available here soon.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
