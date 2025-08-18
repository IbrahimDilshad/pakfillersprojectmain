
'use client';
import { useState } from 'react';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";
import { Calculator, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Based on FBR tax slabs for salaried individuals for respective years.
const taxSlabs = {
  '2024-2025': [
    { limit: 600000, fixed: 0, rate: 0 },
    { limit: 1200000, fixed: 0, rate: 0.05 },
    { limit: 2200000, fixed: 30000, rate: 0.15 },
    { limit: 3200000, fixed: 180000, rate: 0.25 },
    { limit: 4100000, fixed: 430000, rate: 0.35 },
    { limit: Infinity, fixed: 745000, rate: 0.35 }, // Note: Rate is complex above this, simplified for demo
  ],
  '2023-2024': [
    { limit: 600000, fixed: 0, rate: 0 },
    { limit: 1200000, fixed: 0, rate: 0.025 },
    { limit: 2400000, fixed: 15000, rate: 0.125 },
    { limit: 3600000, fixed: 165000, rate: 0.225 },
    { limit: 6000000, fixed: 435000, rate: 0.275 },
    { limit: Infinity, fixed: 1095000, rate: 0.35 },
  ],
  '2022-2023': [
    { limit: 600000, fixed: 0, rate: 0 },
    { limit: 1200000, fixed: 0, rate: 0.025 },
    { limit: 2400000, fixed: 15000, rate: 0.125 },
    { limit: 3600000, fixed: 165000, rate: 0.2 },
    { limit: 6000000, fixed: 405000, rate: 0.25 },
    { limit: 12000000, fixed: 1005000, rate: 0.325 },
    { limit: Infinity, fixed: 2955000, rate: 0.35 },
  ],
   '2021-2022': [
    { limit: 600000, fixed: 0, rate: 0 },
    { limit: 1200000, fixed: 0, rate: 0.05 },
    { limit: 1800000, fixed: 30000, rate: 0.1 },
    { limit: 2500000, fixed: 90000, rate: 0.15 },
    { limit: 3500000, fixed: 195000, rate: 0.175 },
    { limit: 5000000, fixed: 370000, rate: 0.2 },
    { limit: 8000000, fixed: 670000, rate: 0.225 },
    { limit: 12000000, fixed: 1345000, rate: 0.25 },
    { limit: 30000000, fixed: 2345000, rate: 0.275 },
    { limit: 50000000, fixed: 7295000, rate: 0.3 },
    { limit: 75000000, fixed: 13295000, rate: 0.325 },
    { limit: Infinity, fixed: 21420000, rate: 0.35 },
  ],
  // Older years have simpler structures
  '2020-2021': [
    { limit: 600000, fixed: 0, rate: 0 },
    { limit: 1200000, fixed: 0, rate: 0.05 },
    { limit: 1800000, fixed: 30000, rate: 0.1 },
    { limit: 2500000, fixed: 90000, rate: 0.15 },
    { limit: 3500000, fixed: 195000, rate: 0.175},
    { limit: 5000000, fixed: 370000, rate: 0.2},
    { limit: 8000000, fixed: 670000, rate: 0.225},
    { limit: Infinity, fixed: 1345000, rate: 0.25},
  ],
  '2019-2020': [
      { limit: 600000, fixed: 0, rate: 0 },
      { limit: 1200000, fixed: 0, rate: 0.05 },
      { limit: 2400000, fixed: 30000, rate: 0.15 },
      { limit: 3000000, fixed: 180000, rate: 0.2 },
      { limit: 6000000, fixed: 300000, rate: 0.25 },
      { limit: Infinity, fixed: 1050000, rate: 0.3 }
  ],
  '2018-2019': [
      { limit: 400000, fixed: 0, rate: 0 },
      { limit: 800000, fixed: 1000, rate: 0 },
      { limit: 1200000, fixed: 2000, rate: 0 },
      { limit: 2400000, fixed: 0, rate: 0.05},
      { limit: 4800000, fixed: 60000, rate: 0.1},
      { limit: Infinity, fixed: 300000, rate: 0.15},
  ],
  '2017-2018': [
      { limit: 400000, fixed: 0, rate: 0 },
      { limit: 500000, fixed: 0, rate: 0.02 },
      { limit: 750000, fixed: 2000, rate: 0.05 },
      { limit: 1000000, fixed: 14500, rate: 0.1 },
      { limit: Infinity, fixed: 39500, rate: 0.15 } // Simplified, rate increases at higher slabs
  ]
};

type TaxYear = keyof typeof taxSlabs;

interface CalculationResult {
  monthlySalary: number;
  yearlyIncome: number;
  yearlyTax: number;
  monthlyTax: number;
  netMonthlySalary: number;
  netYearlySalary: number;
}

export default function SalaryTaxCalculatorPage() {
  const { t } = useLanguage();
  const [monthlySalary, setMonthlySalary] = useState('');
  const [taxYear, setTaxYear] = useState<TaxYear>('2024-2025');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateTax = () => {
    const salary = parseFloat(monthlySalary);
    if (isNaN(salary) || salary <= 0) {
      setResult(null);
      return;
    }

    const yearlyIncome = salary * 12;
    const slabs = taxSlabs[taxYear];
    let yearlyTax = 0;

    let previousLimit = 0;
    for (const slab of slabs) {
        if (yearlyIncome > previousLimit && yearlyIncome <= slab.limit) {
            yearlyTax = slab.fixed + (yearlyIncome - previousLimit) * slab.rate;
            break;
        }
        previousLimit = slab.limit;
    }
    
    // Handle highest slab
    if (yearlyIncome > slabs[slabs.length - 2].limit) {
        const lastSlab = slabs[slabs.length - 1];
        const secondLastSlab = slabs[slabs.length - 2];
        yearlyTax = lastSlab.fixed + (yearlyIncome - secondLastSlab.limit) * lastSlab.rate;
    }


    const monthlyTax = yearlyTax / 12;

    setResult({
      monthlySalary: salary,
      yearlyIncome: yearlyIncome,
      yearlyTax: yearlyTax,
      monthlyTax: monthlyTax,
      netMonthlySalary: salary - monthlyTax,
      netYearlySalary: yearlyIncome - yearlyTax,
    });
  };

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <AppLayout pageTitle={t({ en: "Salary Tax Calculator", ur: "تنخواہ ٹیکس کیلکولیٹر" })}>
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                {t({ en: "Calculate Your Salary Tax", ur: "اپنی تنخواہ کا ٹیکس شمار کریں" })}
              </CardTitle>
              <CardDescription>
                {t({ en: "Enter your monthly salary and select the tax year to get an estimate of your tax liability.", ur: "اپنی ماہانہ تنخواہ درج کریں اور اپنے ٹیکس کی ذمہ داری کا تخمینہ لگانے کے لیے ٹیکس کا سال منتخب کریں۔" })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthly-salary">{t({ en: "Monthly Salary (PKR)", ur: "ماہانہ تنخواہ (PKR)" })}</Label>
                <Input 
                  id="monthly-salary" 
                  type="number" 
                  placeholder="e.g., 100000" 
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-year">{t({ en: "Tax Year", ur: "ٹیکس کا سال" })}</Label>
                <Select value={taxYear} onValueChange={(value: TaxYear) => setTaxYear(value)}>
                  <SelectTrigger id="tax-year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(taxSlabs).map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateTax} className="w-full">
                {t({ en: "Calculate", ur: "شمار کریں" })}
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="h-full">
             <CardHeader>
              <CardTitle>{t({en: "Calculation Results", ur: "حساب کے نتائج"})}</CardTitle>
              <CardDescription>{t({en: "Here is a breakdown of your estimated tax.", ur: "یہاں آپ کے تخمینہ شدہ ٹیکس کی تفصیل ہے۔"})}</CardDescription>
            </CardHeader>
            <CardContent>
                {result ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="font-medium text-muted-foreground">{t({en: "Monthly Salary", ur: "ماہانہ تنخواہ"})}</div>
                            <div className="text-right font-semibold">{formatCurrency(result.monthlySalary)}</div>
                            
                            <div className="font-medium text-muted-foreground">{t({en: "Yearly Income", ur: "سالانہ آمدنی"})}</div>
                            <div className="text-right font-semibold">{formatCurrency(result.yearlyIncome)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm pt-4 border-t">
                            <div className="font-medium text-muted-foreground">{t({en: "Monthly Tax Deduction", ur: "ماہانہ ٹیکس کٹوتی"})}</div>
                            <div className="text-right font-semibold text-destructive">{formatCurrency(result.monthlyTax)}</div>

                            <div className="font-medium text-muted-foreground">{t({en: "Yearly Tax Deduction", ur: "سالانہ ٹیکس کٹوتی"})}</div>
                            <div className="text-right font-semibold text-destructive">{formatCurrency(result.yearlyTax)}</div>
                        </div>
                         <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm pt-4 border-t">
                            <div className="font-medium text-muted-foreground">{t({en: "Salary after Monthly Tax", ur: "ماہانہ ٹیکس کے بعد تنخواہ"})}</div>
                            <div className="text-right font-semibold text-primary">{formatCurrency(result.netMonthlySalary)}</div>

                            <div className="font-medium text-muted-foreground">{t({en: "Salary after Yearly Tax", ur: "سالانہ ٹیکس کے بعد تنخواہ"})}</div>
                            <div className="text-right font-semibold text-primary">{formatCurrency(result.netYearlySalary)}</div>
                        </div>

                         <Alert variant="destructive" className="mt-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t({en: "Disclaimer", ur: "دستبرداری"})}</AlertTitle>
                            <AlertDescription>
                                {t({en: "This calculation is for informational purposes only. Tax laws are subject to change. Please consult with a tax professional for precise figures.", ur: "یہ حساب صرف معلوماتی مقاصد کے لیے ہے۔ ٹیکس قوانین تبدیل ہو سکتے ہیں۔ درست اعداد و شمار کے لیے براہ کرم ٹیکس پیشہ ور سے مشورہ کریں۔"})}
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                     <div className="flex items-center justify-center h-64 text-muted-foreground">
                        <p>{t({en: "Enter your salary to see the calculation.", ur: "حساب دیکھنے کے لیے اپنی تنخواہ درج کریں۔"})}</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
