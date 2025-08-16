
'use client';

import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useMemo } from 'react';

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
    const { formData } = usePersonalTaxFiling();

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return 'PKR 0';
        return `PKR ${amount.toLocaleString()}`;
    }

    const totalIncome = useMemo(() => {
        return (formData.incomes?.salary?.annualSalary || 0);
    }, [formData.incomes]);

    const totalAssets = useMemo(() => {
        const { properties = 0, bankAccounts = 0, vehicles = 0, cash = 0, otherAssets = 0 } = formData.wealthStatement || {};
        return properties + bankAccounts + vehicles + cash + otherAssets;
    }, [formData.wealthStatement]);

    const totalLiabilities = useMemo(() => {
        return formData.wealthStatement?.liabilities || 0;
    }, [formData.wealthStatement]);

    const netWealth = totalAssets - totalLiabilities;


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
                    <SummaryItem label="Full Name" urLabel="پورا نام" value={formData.personalInfo.fullName || '-'} />
                    <SummaryItem label="Email" urLabel="ای میل" value={formData.personalInfo.email || '-'} />
                    <SummaryItem label="CNIC" urLabel="شناختی کارڈ نمبر" value={formData.personalInfo.cnic || '-'} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">{t({ en: 'Income Summary', ur: 'آمدنی کا خلاصہ' })}</h3>
                <div className="rounded-md border p-4 space-y-2">
                    <SummaryItem label="Total Income" urLabel="کل آمدنی" value={formatCurrency(totalIncome)} />
                    <SummaryItem label="Tax Deducted at Source" urLabel="ماخذ پر کٹوتی ٹیکس" value={formatCurrency(formData.incomes?.salary?.taxDeducted)} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">{t({ en: 'Wealth Statement Summary', ur: 'دولت کے بیان کا خلاصہ' })}</h3>
                <div className="rounded-md border p-4 space-y-2">
                    <SummaryItem label="Total Assets" urLabel="کل اثاثے" value={formatCurrency(totalAssets)} />
                    <SummaryItem label="Total Liabilities" urLabel="کل واجبات" value={formatCurrency(totalLiabilities)} />
                    <Separator />
                    <SummaryItem label="Net Wealth" urLabel="کل دولت" value={formatCurrency(netWealth)} />
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
