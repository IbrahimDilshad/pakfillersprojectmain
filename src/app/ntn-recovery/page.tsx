
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
import { useFormPrices } from '@/hooks/useFormPrices';
import { ServicePricingDisplay } from '@/components/service-pricing-display';

export default function NtnRecoveryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { formPrices } = useFormPrices();
  const serviceCode = 'ntn_recovery';
  
  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    const service = formPrices.find(s => s.id === serviceCode);
    if (service) {
        addItem({
            serviceId: service.id,
            name: service.name,
            price: service.price,
        });
        toast({
            title: t({ en: "Service Added", ur: "سروس شامل کر دی گئی" }),
            description: t({ en: "NTN Recovery has been added to your cart.", ur: "این ٹی این کی بازیابی آپ کی کارٹ میں شامل کر دی گئی ہے۔" })
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
    <AppLayout pageTitle={t({ en: 'NTN Recovery', ur: 'این ٹی این کی بازیابی' })}>
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'NTN Recovery Assistance', ur: 'این ٹی این کی بازیابی میں معاونت' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please provide your CNIC number to proceed with NTN recovery.',
                ur: 'این ٹی این کی بازیابی کے ساتھ آگے بڑھنے کے لیے براہ کرم اپنا شناختی کارڈ نمبر فراہم کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="cnic">{t({ en: 'CNIC Number', ur: 'شناختی کارڈ نمبر' })}</Label>
                        <Input id="cnic" type="text" placeholder="12345-1234567-1" />
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
            {t({ en: 'Add to Cart & Continue', ur: 'کارٹ میں شامل کریں اور جاری رکھیں' })}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
