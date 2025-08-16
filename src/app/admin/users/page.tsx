import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <AppLayout pageTitle="User Management">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Users className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Admin: User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The admin dashboard for managing users will be available here. This feature is currently in development.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
