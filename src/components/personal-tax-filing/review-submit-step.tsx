
'use client';

import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useMemo } from 'react';
import { Badge } from '../ui/badge';
import { useFormPrices } from '@/hooks/useFormPrices';

const SummaryItem = ({ label, value, urLabel }: { label: string; value: string | number; urLabel: string; }) => {
    const { t } = useLanguage();
    if (value === undefined || value === null || value === '' || (typeof value === 'number' && isNaN(value))) return null;
    return (
        <div className="flex justify-between items-center py-2">
            <p className="text-muted-foreground">{t({ en: label, ur: urLabel })}</p>
            <p className="font-medium text-right">{value}</p>
        </div>
    )
};


export function ReviewSubmitStep() {
    const { t } = useLanguage();
    const { formData } = usePersonalTaxFiling();
    const { formPrices } = useFormPrices();

    const servicePrice = useMemo(() => {
        const service = formPrices.find(s => s.id === 'personal_tax_filing');
        return service ? service.price : 3000; // Default price
    }, [formPrices]);

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null || isNaN(amount)) return 'PKR 0';
        return `PKR ${amount.toLocaleString()}`;
    }

    const totalIncome = useMemo(() => {
        // This should be expanded to include all income sources
        return (formData.incomes?.salary?.annualSalary || 0);
    }, [formData.incomes]);

    const totalDeductions = useMemo(() => {
        const bankDeductions = formData.deductions?.bank?.reduce((acc, item) => acc + (item.taxDeducted || 0), 0) || 0;
        const vehicleDeductions = formData.deductions?.vehicle?.reduce((acc, item) => acc + (item.taxDeduction || 0), 0) || 0;
        const utilityDeductions = formData.deductions?.utility?.reduce((acc, item) => acc + (item.taxDeduction || 0), 0) || 0;
        return bankDeductions + vehicleDeductions + utilityDeductions;
    }, [formData.deductions]);


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
                    <SummaryItem label="Full Name" urLabel="پورا نام" value={formData.personalInfo?.fullName || '-'} />
                    <SummaryItem label="Email" urLabel="ای میل" value={formData.personalInfo?.email || '-'} />
                    <SummaryItem label="Phone Number" urLabel="فون نمبر" value={formData.personalInfo?.phoneNumber || '-'} />
                    <SummaryItem label="Occupation" urLabel="پیشہ" value={formData.personalInfo?.occupation || '-'} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">{t({ en: 'Income Summary', ur: 'آمدنی کا خلاصہ' })}</h3>
                <div className="rounded-md border p-4 space-y-2">
                    <SummaryItem label="Total Salary" urLabel="کل تنخواہ" value={formatCurrency(totalIncome)} />
                    <SummaryItem label="Tax Deducted on Salary" urLabel="تنخواہ پر کٹوتی ٹیکس" value={formatCurrency(formData.incomes?.salary?.taxDeducted)} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">{t({ en: 'Deductions Summary', ur: 'کٹوتی کا خلاصہ' })}</h3>
                <div className="rounded-md border p-4 space-y-2">
                    <SummaryItem label="Total Deductions Claimed" urLabel="کل دعوی شدہ کٹوتیاں" value={formatCurrency(totalDeductions)} />
                </div>
            </div>

             <div>
                <h3 className="text-lg font-semibold mb-2">{t({ en: 'Service Fee', ur: 'سروس فیس' })}</h3>
                <div className="rounded-md border p-4 flex justify-between items-center">
                    <p className="text-muted-foreground">{t({en: 'Personal Tax Filing Service', ur: 'ذاتی ٹیکس فائلنگ سروس'})}</p>
                    <Badge variant="secondary" className="text-lg font-bold">PKR {servicePrice.toLocaleString()}</Badge>
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
