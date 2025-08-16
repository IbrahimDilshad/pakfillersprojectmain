import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSignature } from "lucide-react";

export default function FilingPage() {
  return (
    <AppLayout pageTitle="Tax Filing">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileSignature className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Tax Filing Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our streamlined tax filing workflow is currently under development. Soon you'll be able to file your personal and family taxes right from here.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
