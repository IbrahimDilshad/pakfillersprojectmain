
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, MessageSquare, PlusCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useServices } from "@/hooks/useServices";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// A simple component to render the WhatsApp icon
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    <path d="M12.04 18.02c-1.39-1.39-2.03-3.6-2.03-5.02s.64-3.63 2.03-5.02"></path>
    <path d="M15.04 21.02c-1.39-1.39-2.03-3.6-2.03-5.02s.64-3.63 2.03-5.02"></path>
  </svg>
);


export default function ServicesPage() {
  const { t } = useLanguage();
  const { services, loading } = useServices();

  const handleChatClick = () => {
    // This is a bit of a hack to click the chat widget button if it exists
    const chatButton = document.querySelector('[data-chat-widget-button]') as HTMLElement | null;
    if (chatButton) {
        // If the chat window isn't open, click the button to open it
        const chatWindow = document.querySelector('[data-chat-widget-window]');
        if (!chatWindow) {
             chatButton.click();
        }
    }
  };

  return (
    <AppLayout pageTitle={t({ en: "Service Charges", ur: "سروس چارجز" })}>
       <div className="space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                    <CreditCard className="h-12 w-12" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">{t({en: "Our Services", ur: "ہماری خدمات"})}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{t({en: "Transparent pricing for all your tax and business needs.", ur: "آپ کی تمام ٹیکس اور کاروباری ضروریات کے لیے شفاف قیمتیں۔"})}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array.from({length: 3}).map((_, i) => (
                        <Card key={i} className="flex flex-col">
                            <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                            <CardFooter className="grid grid-cols-2 gap-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    services.map(service => (
                        <Card key={service.id} className="flex flex-col hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-2xl">{t(service.title)}</CardTitle>
                                <CardDescription>{t({en: "Completion in:", ur: "تکمیل کا وقت:"})} {t(service.completionTime)}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <Badge variant="secondary" className="text-lg font-bold py-1 px-3">
                                    {t({en: "PKR", ur: "روپے"})}{" "}
                                    {service.price.toLocaleString(language === 'en' ? 'en-US' : 'ur-PK')}
                                </Badge>
                                <div 
                                    className="prose prose-sm text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: t(service.details) }}
                                />
                            </CardContent>
                            <CardFooter className="grid grid-cols-2 gap-2 mt-4">
                                <a href={`https://wa.me/${service.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button variant="outline" className="w-full">
                                        <WhatsAppIcon />
                                        {t({en: "WhatsApp", ur: "واٹس ایپ"})}
                                    </Button>
                                </a>
                                <Button onClick={handleChatClick} className="w-full">
                                    <MessageSquare />
                                    {t({en: "Chat", ur: "چیٹ"})}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
             {!loading && services.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <p>{t({en: "No services have been added yet.", ur: "ابھی تک کوئی خدمات شامل نہیں کی گئی ہیں۔"})}</p>
                </div>
            )}
       </div>
    </AppLayout>
  );
}
