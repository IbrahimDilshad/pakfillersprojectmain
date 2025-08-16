'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AdminChatPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Admin Chat", ur: "ایڈمن چیٹ" })}>
      <Card className="m-auto mt-12 max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <MessageSquare className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">{t({ en: "Admin Support Chat", ur: "ایڈمن سپورٹ چیٹ" })}</CardTitle>
          <CardDescription>
            {t({ en: "This is where support staff can view and respond to user chats in real-time.", ur: "یہ وہ جگہ ہے جہاں سپورٹ اسٹاف حقیقی وقت میں صارف کی چیٹس کو دیکھ اور جواب دے سکتا ہے۔" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t({ en: "The chat management interface is under construction.", ur: "چیٹ مینجمنٹ انٹرفیس زیر تعمیر ہے۔" })}
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
