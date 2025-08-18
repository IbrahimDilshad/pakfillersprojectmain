
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function IrisEmployerInfoPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = () => {
    // In a real app, you would collect all form data and process it.
    toast({
      title: "Service Added to Cart",
      description: "IRIS Profile update service has been added to your cart.",
    });
    router.push('/cart');
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
