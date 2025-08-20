
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useServices } from '@/hooks/useServices';

export default function AddBusinessToNtnPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const { addItem } = useCart();
  const { services } = useServices();

  const handleContinue = () => {
    const service = services.find(s => t(s.title).toLowerCase().includes('add business to ntn'));
    if (service) {
        addItem(service);
        toast({
            title: t({ en: "Service Added", ur: "سروس شامل کر دی گئی" }),
            description: t({ en: "Add Business to NTN has been added to your cart.", ur: "این ٹی این میں کاروبار شامل کریں آپ کی کارٹ میں شامل کر دیا گیا ہے۔" })
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
    <AppLayout pageTitle={t({ en: 'Add Business to NTN', ur: 'این ٹی این میں کاروبار شامل کریں' })}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'Provide Business & IRIS Details', ur: 'کاروبار اور آئرس کی تفصیلات فراہم کریں' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please provide the required information to add the business to your NTN.',
                ur: 'اپنے این ٹی این میں کاروبار شامل کرنے کے لیے براہ کرم مطلوبہ معلومات فراہم کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="businessName">{t({ en: 'Business Name', ur: 'کاروبار کا نام' })}</Label>
                        <Input id="businessName" placeholder={t({ en: 'e.g., New Ventures Inc.', ur: 'مثلاً، نیو وینچرز انکارپوریٹڈ' })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t({ en: 'Registered Email', ur: 'رجسٹرڈ ای میل' })}</Label>
                        <Input id="email" type="email" placeholder="business@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">{t({ en: 'Phone Number', ur: 'فون نمبر' })}</Label>
                        <Input id="phoneNumber" type="tel" placeholder="+92 300 1234567" />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="startDate">{t({ en: 'Business Start Date', ur: 'کاروبار شروع کرنے کی تاریخ' })}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>{t({en: "Pick a date", ur: "ایک تاریخ منتخب کریں"})}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="irisPin">{t({ en: 'IRIS PIN', ur: 'آئرس پن' })}</Label>
                        <Input id="irisPin" type="password" placeholder="••••" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="irisPassword">{t({ en: 'IRIS Password', ur: 'آئرس پاس ورڈ' })}</Label>
                         <div className="flex items-center gap-2">
                            <Input id="irisPassword" type="password" placeholder="••••••••" className="flex-1" />
                            <Link href="/business-incorporation/forgot-password" className="text-sm text-primary underline whitespace-nowrap">
                                {t({ en: 'Forgot?', ur: 'بھول گئے؟' })}
                            </Link>
                         </div>
                    </div>
                </div>
            </form>
          </CardContent>
        </Card>
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
