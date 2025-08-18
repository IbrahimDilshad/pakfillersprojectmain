
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';

export default function AopPartnershipPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleNext = () => {
    router.push('/business-incorporation/aop-partnership/documents');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AppLayout pageTitle={t({ en: 'AOP/Partnership Registration', ur: 'اے او پی/شراکت داری کی رجسٹریشن' })}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'Business Details', ur: 'کاروبار کی تفصیلات' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please provide the required information for your partnership.',
                ur: 'براہ کرم اپنی شراکت داری کے لیے مطلوبہ معلومات فراہم کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">{t({ en: 'Business Name', ur: 'کاروبار کا نام' })}</Label>
                <Input id="businessName" placeholder={t({ en: 'e.g., Acme Partners', ur: 'مثلاً، ایکمی پارٹنرز' })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t({ en: 'Email', ur: 'ای میل' })}</Label>
                <Input id="email" type="email" placeholder="partners@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t({ en: 'Phone Number', ur: 'فون نمبر' })}</Label>
                <Input id="phoneNumber" type="tel" placeholder="+92 300 1234567" />
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="flex justify-between mt-6">
          <Button onClick={handleBack} variant="outline">
            {t({ en: 'Back', ur: 'پیچھے' })}
          </Button>
          <Button onClick={handleNext}>
            {t({ en: 'Next', ur: 'اگلا' })}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
