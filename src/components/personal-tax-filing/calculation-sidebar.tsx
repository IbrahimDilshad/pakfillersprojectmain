
'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';

const SummaryItem = ({ label, value, urLabel, className }: { label: string; value: string | number; urLabel: string; className?: string }) => {
    const { t } = useLanguage();
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) return null;

    return (
        <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">{t({ en: label, ur: urLabel })}</p>
            <p className={cn("font-mono text-right", className)}>{value}</p>
        </div>
    )
};


export function CalculationSidebar() {
    const { t } = useLanguage();
    const { formData } = usePersonalTaxFiling();

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null || isNaN(amount)) return 'PKR 0';
        return `PKR ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    const totalIncome = useMemo(() => {
        // This should be expanded to include all income sources
        return (formData.incomes?.salary?.annualSalary || 0);
    }, [formData.incomes]);

    const taxPaid = useMemo(() => {
        const salaryTax = formData.incomes?.salary?.taxDeducted || 0;
        const bankDeductions = formData.deductions?.bank?.reduce((acc, item) => acc + (item.taxDeducted || 0), 0) || 0;
        const vehicleDeductions = formData.deductions?.vehicle?.reduce((acc, item) => acc + (item.taxDeduction || 0), 0) || 0;
        const utilityDeductions = formData.deductions?.utility?.reduce((acc, item) => acc + (item.taxDeduction || 0), 0) || 0;
        // Add other deduction types here as they are implemented
        return salaryTax + bankDeductions + vehicleDeductions + utilityDeductions;
    }, [formData.incomes, formData.deductions]);
    
    const openingWealth = formData.wealthStatement?.openingWealth || 0;
    const expenses = formData.expense?.totalHouseholdExpense || 0;
    
    const closingWealth = (openingWealth + totalIncome) - expenses - taxPaid;
    const difference = 0; // This would require assets to be calculated. Placeholder.
    const assetsAtClosing = closingWealth; // Simplified for now.

    // A real tax liability calculation would be needed for refundable amount. Placeholder.
    const refundable = taxPaid > 0 ? 'Calculated...' : formatCurrency(0);


    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "Summary", ur: "خلاصہ" })}</CardTitle>
                <CardDescription>{t({en: "Live calculation based on your input.", ur: "آپ کے ان پٹ کی بنیاد پر لائیو حساب کتاب۔"})}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm">{t({en: 'Income Tax', ur: 'انکم ٹیکس'})}</h4>
                    <div className="p-3 border rounded-md space-y-2">
                        <SummaryItem label="Tax Paid" urLabel="ٹیکس ادا کیا" value={formatCurrency(taxPaid)} />
                        <SummaryItem label="Refundable" urLabel="واپسی کے قابل" value={refundable} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <h4 className="font-semibold text-sm">{t({en: 'Wealth Reconciliation', ur: 'دولت کا مفاہمت'})}</h4>
                    <div className="p-3 border rounded-md space-y-2">
                        <SummaryItem label="Opening Wealth" urLabel="ابتدائی دولت" value={formatCurrency(openingWealth)} />
                        <SummaryItem label="Income" urLabel="آمدنی" value={formatCurrency(totalIncome)} />
                         <SummaryItem label="Expenses" urLabel="اخراجات" value={formatCurrency(expenses)} />
                         <SummaryItem label="Tax Paid" urLabel="ٹیکس ادا کیا" value={formatCurrency(taxPaid)} />
                         <Separator />
                        <SummaryItem label="Closing Wealth" urLabel="اختتامی دولت" value={formatCurrency(closingWealth)} className="font-bold text-primary" />
                        <SummaryItem label="Difference" urLabel="فرق" value={formatCurrency(difference)} />
                    </div>
                </div>

                 <div className="space-y-2">
                     <h4 className="font-semibold text-sm">{t({en: 'Asset at Closing', ur: 'اختتامی اثاثہ'})}</h4>
                     <div className="p-3 border rounded-md space-y-2">
                        <SummaryItem label="Total" urLabel="کل" value={formatCurrency(assetsAtClosing)} className="font-bold" />
                    </div>
                 </div>
            </CardContent>
        </Card>
    );
}
