
'use client';
import { AppLayout } from "@/components/app-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFaqs } from "@/hooks/useFaqs";
import { useLanguage } from "@/context/language-context";
import { FileQuestion } from "lucide-react";

export default function FaqsPage() {
  const { t } = useLanguage();
  const { faqs, loading } = useFaqs();

  return (
    <AppLayout pageTitle={t({ en: "FAQs", ur: "اکثر پوچھے گئے سوالات" })}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                <FileQuestion className="h-10 w-10" />
            </div>
          <CardTitle className="text-3xl">{t({ en: "Frequently Asked Questions", ur: "اکثر پوچھے گئے سوالات" })}</CardTitle>
          <CardDescription>{t({ en: "Find answers to common questions about our services.", ur: "ہماری خدمات کے بارے میں عام سوالات کے جوابات تلاش کریں۔" })}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="w-full h-14" />)}
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">{t(faq.question)}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t(faq.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
           {!loading && faqs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                    {t({ en: "No FAQs have been added yet.", ur: "ابھی تک کوئی سوالات شامل نہیں کیے گئے ہیں۔" })}
                </p>
           )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
