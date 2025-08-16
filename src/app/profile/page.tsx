import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <AppLayout pageTitle="IRIS Profile">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <User className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">View/Update IRIS Profile Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Soon you will be able to view and update your IRIS profile information directly from PakFiler, keeping your details up-to-date effortlessly.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
