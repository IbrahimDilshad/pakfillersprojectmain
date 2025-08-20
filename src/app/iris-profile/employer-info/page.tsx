
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useServices } from '@/hooks/useServices';

export default function IrisEmployerInfoPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { services } = useServices();

  const handleSubmit = () => {
    const service = services.find(s => t(s.title).toLowerCase().includes('iris profile update'));
    if (service) {
        addItem(service);
        toast({
            title: t({ en: "Service Added", ur: "سروس شامل کر دی گئی" }),
            description: t({ en: "IRIS Profile Update has been added to your cart.", ur: "آئرس پروفائل اپ ڈیٹ آپ کی کارٹ میں شامل کر دی گئی ہے۔" })
        });
        router.push('/cart');
    } else {
        toast({
            variant: 'destructive',
            title: t({ en: "Service Not Found", ur: "سروس نہیں ملی" }),
            description: t({ en: "This service is currently unavailable.", ur: "یہ سروس فی الحال دستیاب نہیں ہے۔" })
        });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AppLayout pageTitle={t({ en: 'Employer Information', ur: 'آجر کی معلومات' })}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'Employer Information', ur: 'آجر کی معلومات' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please provide your employer\'s name.',
                ur: 'براہ کرم اپنے آجر کا نام فراہم کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employerName">{t({ en: 'Employer Name', ur: 'آجر کا نام' })}</Label>
                <Input id="employerName" placeholder={t({ en: 'e.g., PakFiler Corp', ur: 'مثلاً، پاک فائلر کارپوریشن' })} />
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="flex justify-between mt-6">
          <Button onClick={handleBack} variant="outline">
            {t({ en: 'Back', ur: 'پیچھے' })}
          </Button>
          <Button onClick={handleSubmit}>
            {t({ en: 'Submit & Add to Cart', ur: 'جمع کرائیں اور کارٹ میں شامل کریں' })}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
