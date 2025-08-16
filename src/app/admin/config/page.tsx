import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminConfigPage() {
  return (
    <AppLayout pageTitle="System Configuration">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Settings className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Admin: System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tools for system-wide configuration and settings will be located here. This section is under construction.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
