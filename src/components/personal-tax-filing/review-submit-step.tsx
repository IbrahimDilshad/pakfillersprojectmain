
'use client';

import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const SummaryItem = ({ label, value, urLabel }: { label: string; value: string | number; urLabel: string; }) => {
    const { t } = useLanguage();
    return (
        <div className="flex justify-between items-center py-2">
            <p className="text-muted-foreground">{t({ en: label, ur: urLabel })}</p>
            <p className="font-medium">{value}</p>
        </div>
    )
};


export function ReviewSubmitStep() {
    const { t } = useLanguage();

  return (
    <div>
        <div className="mb-6">
            <CardTitle>{t({ en: 'Review & Submit', ur: 'جائزہ لیں اور جمع کرائیں' })}</CardTitle>
            <CardDescription>{t({ en: 'Please review all the information carefully before submitting.', ur: 'براہ کرم جمع کرانے سے پہلے تمام معلومات کا بغور جائزہ لیں۔' })}</CardDescription>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">{t({ en: 'Personal Information', ur: 'ذاتی معلومات' })}</h3>
                <div className="rounded-md border p-4 space-y-2">
                    <SummaryItem label="Full Name" urLabel="پورا نام" value="John Doe" />
                    <SummaryItem label="Email" urLabel="ای میل" value="john.doe@example.com" />
                    <SummaryItem label="CNIC" urLabel="شناختی کارڈ نمبر" value="12345-1234567-1" />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">{t({ en: 'Income Summary', ur: 'آمدنی کا خلاصہ' })}</h3>
                <div className="rounded-md border p-4 space-y-2">
                    <SummaryItem label="Total Income" urLabel="کل آمدنی" value="PKR 1,250,000" />
                    <SummaryItem label="Tax Deducted at Source" urLabel="ماخذ پر کٹوتی ٹیکس" value="PKR 25,000" />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">{t({ en: 'Wealth Statement Summary', ur: 'دولت کے بیان کا خلاصہ' })}</h3>
                <div className="rounded-md border p-4 space-y-2">
                    <SummaryItem label="Total Assets" urLabel="کل اثاثے" value="PKR 5,000,000" />
                    <SummaryItem label="Total Liabilities" urLabel="کل واجبات" value="PKR 500,000" />
                    <Separator />
                    <SummaryItem label="Net Wealth" urLabel="کل دولت" value="PKR 4,500,000" />
                </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                {t({ en: 'I confirm that the information provided is accurate to the best of my knowledge.', ur: 'میں تصدیق کرتا ہوں کہ فراہم کردہ معلومات میرے علم کے مطابق درست ہیں۔' })}
                </Label>
            </div>
        </div>
    </div>
  );
}
