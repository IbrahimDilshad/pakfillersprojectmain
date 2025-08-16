import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch } from "lucide-react";

export default function ReviewPage() {
  return (
    <AppLayout pageTitle="Review Documents">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileSearch className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Accountant: Document Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is for accountants to review and approve user-submitted documents. This feature is currently under development.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
