
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";
import { Calculator, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const taxSlabs = {
  '2024-2025': [
    { limit: 600000, fixed: 0, rate: 0 },
    { limit: 1200000, fixed: 0, rate: 0.05 },
    { limit: 2200000, fixed: 30000, rate: 0.15 },
    { limit: 3200000, fixed: 180000, rate: 0.25 },
    { limit: 4100000, fixed: 430000, rate: 0.35 },
    { limit: Infinity, fixed: 745000, rate: 0.35 },
  ],
  '2023-2024': [
    { limit: 600000, fixed: 0, rate: 0 },
    { limit: 1200000, fixed: 0, rate: 0.025 },
    { limit: 2400000, fixed: 15000, rate: 0.125 },
    { limit: 3600000, fixed: 165000, rate: 0.225 },
    { limit: 6000000, fixed: 435000, rate: 0.275 },
    { limit: Infinity, fixed: 1095000, rate: 0.35 },
  ],
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

export function IncomeTaxCalculator() {
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
    <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2">
           <Card className="bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                {t({ en: "Calculate Your Salary Tax", ur: "اپنی تنخواہ کا ٹیکس شمار کریں" })}
              </CardTitle>
              <CardDescription>
                {t({ en: "Enter your monthly salary and select the tax year.", ur: "اپنی ماہانہ تنخواہ درج کریں اور ٹیکس کا سال منتخب کریں۔" })}
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
          <Card className="h-full bg-background">
             <CardHeader>
              <CardTitle>{t({en: "Calculation Results", ur: "حساب کے نتائج"})}</CardTitle>
              <CardDescription>{t({en: "Here is a breakdown of your estimated tax.", ur: "یہاں آپ کے تخمینہ شدہ ٹیکس کی تفصیل ہے۔"})}</CardDescription>
            </CardHeader>
            <CardContent>
                {result ? (
                    <div className="space-y-4">
                       <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t({en: "Description", ur: "تفصیل"})}</TableHead>
                                <TableHead className="text-right">{t({en: "Monthly", ur: "ماہانہ"})}</TableHead>
                                <TableHead className="text-right">{t({en: "Yearly", ur: "سالانہ"})}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{t({en: "Gross Salary", ur: "مجموعی تنخواہ"})}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(result.monthlySalary)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(result.yearlyIncome)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="text-destructive">{t({en: "Tax Deduction", ur: "ٹیکس کٹوتی"})}</TableCell>
                                <TableCell className="text-right font-medium text-destructive">{formatCurrency(result.monthlyTax)}</TableCell>
                                <TableCell className="text-right font-medium text-destructive">{formatCurrency(result.yearlyTax)}</TableCell>
                            </TableRow>
                             <TableRow className="bg-muted/50">
                                <TableCell className="font-semibold text-primary">{t({en: "Net Salary (Take Home)", ur: "خالص تنخواہ (گھر لے جانے والی)"})}</TableCell>
                                <TableCell className="text-right font-semibold text-primary">{formatCurrency(result.netMonthlySalary)}</TableCell>
                                <TableCell className="text-right font-semibold text-primary">{formatCurrency(result.netYearlySalary)}</TableCell>
                            </TableRow>
                        </TableBody>
                       </Table>
                         <Alert variant="destructive" className="mt-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t({en: "Disclaimer", ur: "دستبرداری"})}</AlertTitle>
                            <AlertDescription>
                                {t({en: "This calculation is for informational purposes only. Tax laws are subject to change.", ur: "یہ حساب صرف معلوماتی مقاصد کے لیے ہے۔ ٹیکس قوانین تبدیل ہو سکتے ہیں۔"})}
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                     <div className="flex items-center justify-center h-64 text-muted-foreground bg-muted/50 rounded-lg">
                        <p>{t({en: "Enter your salary to see the calculation.", ur: "حساب دیکھنے کے لیے اپنی تنخواہ درج کریں۔"})}</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
