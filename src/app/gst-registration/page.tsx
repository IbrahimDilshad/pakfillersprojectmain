
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function GstRegistrationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [date, setDate] = useState<Date>();

  const handleNext = () => {
    router.push('/gst-registration/documents');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AppLayout pageTitle={t({ en: 'GST Registration', ur: 'جی ایس ٹی رجسٹریشن' })}>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'GST Registration - Business Details', ur: 'جی ایس ٹی رجسٹریشن - کاروباری تفصیلات' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please provide the required information for your business.',
                ur: 'براہ کرم اپنے کاروبار کے لیے مطلوبہ معلومات فراہم کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="businessName">{t({ en: 'Business Name', ur: 'کاروبار کا نام' })}</Label>
                        <Input id="businessName" placeholder={t({ en: 'e.g., PakFiler Pvt. Ltd.', ur: 'مثلاً، پاک فائلر پرائیویٹ لمیٹڈ' })} />
                    </div>
                    <div className="space-y-2">
                        <Label>{t({ en: 'Business Type', ur: 'کاروبار کی قسم' })}</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder={t({ en: 'Select business type', ur: 'کاروبار کی قسم منتخب کریں' })} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="company">{t({ en: 'Company/NPO', ur: 'کمپنی/این پی او' })}</SelectItem>
                                <SelectItem value="aop">{t({ en: 'AOP/Partnership', ur: 'اے او پی/شراکت داری' })}</SelectItem>
                                <SelectItem value="individual">{t({ en: 'Individual/Sole Proprietor', ur: 'انفرادی/واحد ملکیت' })}</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Label>{t({ en: 'Nature of Business', ur: 'کاروبار کی نوعیت' })}</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder={t({ en: 'Select business nature', ur: 'کاروبار کی نوعیت منتخب کریں' })} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="retailer">{t({ en: 'Retailer', ur: 'ریٹیلر' })}</SelectItem>
                                <SelectItem value="manufacturer">{t({ en: 'Manufacturer', ur: 'مینوفیکچرر' })}</SelectItem>
                                <SelectItem value="wholesaler">{t({ en: 'Wholesaler/Distributor', ur: 'تھوک فروش/ڈسٹریبیوٹر' })}</SelectItem>
                                <SelectItem value="importer">{t({ en: 'Commercial Importer', ur: 'کمرشل امپورٹر' })}</SelectItem>
                                <SelectItem value="exporter">{t({ en: 'Exporter', ur: 'ایکسپورٹر' })}</SelectItem>
                                <SelectItem value="other">{t({ en: 'Other', ur: 'دیگر' })}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">{t({ en: 'Description of Business Activities', ur: 'کاروباری سرگرمیوں کی تفصیل' })}</Label>
                        <Textarea id="description" placeholder={t({ en: 'Describe what your business does...', ur: 'بیان کریں کہ آپ کا کاروبار کیا کرتا ہے...' })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="consumerNumber">{t({ en: 'Electricity/Gas Consumer Number', ur: 'بجلی/گیس کا صارف نمبر' })}</Label>
                        <Input id="consumerNumber" placeholder={t({ en: 'Enter consumer number', ur: 'صارف نمبر درج کریں' })} />
                    </div>
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
