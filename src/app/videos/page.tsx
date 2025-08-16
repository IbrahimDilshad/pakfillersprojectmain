import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

export default function VideosPage() {
  return (
    <AppLayout pageTitle="Videos">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <PlayCircle className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Featured Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A complete list of our helpful video guides will be available here soon. Stay tuned for more content!
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
