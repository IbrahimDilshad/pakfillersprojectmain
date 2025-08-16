import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp } from "lucide-react";

export default function DocumentsPage() {
  return (
    <AppLayout pageTitle="Documents">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileUp className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Document Management Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A secure place to upload and manage all your tax-related documents is on its way. Stay tuned for an easy-to-use document management system.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
