import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCog } from "lucide-react";

export default function AdminContentPage() {
  return (
    <AppLayout pageTitle="Content Management">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <FileCog className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Admin: Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A system for managing site content, such as FAQs and guidelines, will be available here for administrators. This feature is in progress.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
