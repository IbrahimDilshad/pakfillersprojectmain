import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <AppLayout pageTitle="Blog">
      <Card className="m-auto mt-12 max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <BookOpen className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Our Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A complete list of our blog posts will be available here soon. Stay tuned for insightful articles and updates.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
