
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useFormPrices } from '@/hooks/useFormPrices';
import { ServicePricingDisplay } from '@/components/service-pricing-display';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { formPrices } = useFormPrices();
  const serviceCode = 'password_recovery';

  const handleContinue = () => {
    const service = formPrices.find(s => s.id === serviceCode);
    if (service) {
        addItem({
            serviceId: service.id,
            name: service.name,
            price: service.price,
        });
        toast({
            title: t({ en: "Service Added", ur: "سروس شامل کر دی گئی" }),
            description: t({ en: "Password Recovery Assistance has been added to your cart.", ur: "پاس ورڈ کی بازیابی میں معاونت آپ کی کارٹ میں شامل کر دی گئی ہے۔" })
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
    <AppLayout pageTitle={t({ en: 'Forgot IRIS Password', ur: 'آئرس پاس ورڈ بھول گئے' })}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'Password Recovery Assistance', ur: 'پاس ورڈ کی بازیابی میں معاونت' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please provide your registered phone number to proceed.',
                ur: 'آگے بڑھنے کے لیے براہ کرم اپنا رجسٹرڈ فون نمبر فراہم کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t({ en: 'Registered Phone Number', ur: 'رجسٹرڈ فون نمبر' })}</Label>
              <Input id="phoneNumber" type="tel" placeholder="+92 300 1234567" />
            </div>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t({ en: 'Important Notice', ur: 'اہم نوٹس' })}</AlertTitle>
              <AlertDescription>
                {t({
                  en: 'If this phone number is not registered with your FBR documents, you may need to visit an FBR office in person to complete the recovery process.',
                  ur: 'اگر یہ فون نمبر آپ کے ایف بی آر دستاویزات کے ساتھ رجسٹرڈ نہیں ہے، تو آپ کو بازیابی کا عمل مکمل کرنے کے لیے ذاتی طور پر ایف بی آر کے دفتر جانا پڑ سکتا ہے۔',
                })}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
         <div className="flex justify-between items-center mt-6">
            <ServicePricingDisplay serviceCode={serviceCode} />
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={handleBack} variant="outline">
            {t({ en: 'Back', ur: 'پیچھے' })}
          </Button>
          <Button onClick={handleContinue}>
            {t({ en: 'Add to Cart & Continue', ur: 'کارٹ میں شامل کریں اور جاری رکھیں' })}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
