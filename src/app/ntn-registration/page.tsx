
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { useServices } from '@/hooks/useServices';
import { ServicePricingDisplay } from '@/components/service-pricing-display';

export default function NtnRegistrationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { services } = useServices();
  const serviceCode = 'ntn_registration';
  
  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    const service = services.find(s => s.serviceCode === serviceCode);
    if (service) {
        addItem({
            id: service.id,
            serviceId: service.id,
            name: service.title,
            price: service.price,
        });
        toast({
            title: t({ en: "Service Added", ur: "سروس شامل کر دی گئی" }),
            description: t({ en: "NTN Registration has been added to your cart.", ur: "این ٹی این رجسٹریشن آپ کی کارٹ میں شامل کر دی گئی ہے۔" })
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

  return (
    <AppLayout pageTitle={t({ en: 'NTN Registration', ur: 'این ٹی این رجسٹریشن' })}>
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'Provide FBR Credentials', ur: 'ایف بی آر کی اسناد فراہم کریں' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please enter your FBR password and PIN to proceed.',
                ur: 'آگے بڑھنے کے لیے براہ کرم اپنا ایف بی آر پاس ورڈ اور پن درج کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="fbr-pin">{t({ en: 'FBR PIN', ur: 'ایف بی آر پن' })}</Label>
                        <Input id="fbr-pin" type="password" placeholder="••••" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fbr-password">{t({ en: 'FBR Password', ur: 'ایف بی آر پاس ورڈ' })}</Label>
                        <Input id="fbr-password" type="password" placeholder="••••••••" />
                    </div>
                </div>
            </form>
          </CardContent>
        </Card>
        <div className="flex justify-between items-center mt-6">
            <ServicePricingDisplay serviceCode={serviceCode} />
        </div>
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
