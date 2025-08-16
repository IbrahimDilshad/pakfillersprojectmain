import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function AdminChatPage() {
  return (
    <AppLayout pageTitle="Admin Chat">
      <Card className="m-auto mt-12 max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <MessageSquare className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Admin Support Chat</CardTitle>
          <CardDescription>
            This is where support staff can view and respond to user chats in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The chat management interface is under construction.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
