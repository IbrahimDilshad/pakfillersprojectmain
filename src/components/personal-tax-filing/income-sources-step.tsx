
'use client';
import { useState, useMemo, useEffect } from 'react';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { Briefcase, Building2, User, Laptop, GraduationCap, Landmark, Tractor, Percent, Cog, Users, Home, PiggyBank, AreaChart, TrendingUp, PlusCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const incomeSourcesList = [
  { id: 'hasSalary', label: { en: 'Salary', ur: 'تنخواہ' }, icon: Briefcase },
  { id: 'hasBusiness', label: { en: 'Business', ur: 'کاروبار' }, icon: Building2 },
  { id: 'hasSelfEmployed', label: { en: 'Self Employed', ur: 'خود ملازم' }, icon: User },
  { id: 'hasFreelancer', label: { en: 'Freelancer', ur: 'فری لانسر' }, icon: Laptop },
  { id: 'hasProfessional', label: { en: 'Professional', ur: 'پیشہ ور' }, icon: GraduationCap },
  { id: 'hasPension', label: { en: 'Pension', ur: 'پنشن' }, icon: Landmark },
  { id: 'hasAgriculture', label: { en: 'Agriculture', ur: 'زراعت' }, icon: Tractor },
  { id: 'hasCommission', label: { en: 'Commission', ur: 'کمیشن' }, icon: Percent },
  { id: 'hasServices', label: { en: 'Services', ur: 'خدمات' }, icon: Cog },
  { id: 'hasPartnership', label: { en: 'Partnership/AOP', ur: 'شراکت/اے او پی' }, icon: Users },
  { id: 'hasRent', label: { en: 'Rent/Property Sale', ur: 'کرایہ/جائیداد فروخت' }, icon: Home },
  { id: 'hasSavingsProfit', label: { en: 'Profit on Savings', ur: 'بچت پر منافع' }, icon: PiggyBank },
  { id: 'hasDividend', label: { en: 'Dividend', ur: 'منافع' }, icon: AreaChart },
  { id: 'hasGain', label: { en: 'Gain', ur: 'فائدہ' }, icon: TrendingUp },
  { id: 'hasOther', label: { en: 'Other Income', ur: 'دیگر آمدنی' }, icon: PlusCircle },
];

// Define Zod schema for the Salary form
const salaryFormSchema = z.object({
  annualSalary: z.coerce.number().min(1, 'Annual salary is required'),
  taxDeducted: z.coerce.number().optional(),
});
type SalaryFormData = z.infer<typeof salaryFormSchema>;

// The Salary Form Component
function SalaryForm() {
    const { t } = useLanguage();
    const { formData, setFormData } = usePersonalTaxFiling();
    const form = useForm<SalaryFormData>({
        resolver: zodResolver(salaryFormSchema),
        defaultValues: formData.incomes.salary || {},
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            setFormData(prev => ({
                ...prev,
                incomes: { ...prev.incomes, salary: value as SalaryFormData }
            }));
        });
        return () => subscription.unsubscribe();
    }, [form, setFormData]);

    return (
        <Form {...form}>
            <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="annualSalary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t({ en: 'Total Annual Salary / Remuneration', ur: 'کل سالانہ تنخواہ / معاوضہ' })}</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="PKR" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="taxDeducted"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t({ en: 'Tax Deducted at Source by Employer', ur: 'آجر کی طرف سے ماخذ پر کٹوتی ٹیکس' })}</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="PKR" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
}


// --- Main Component ---
export function IncomeSourcesStep({ onContinue }: { onContinue: () => void }) {
    const { t } = useLanguage();
    const { formData, setFormData } = usePersonalTaxFiling();
    const [stage, setStage] = useState<'selection' | 'forms'>('selection');

    const toggleSource = (sourceId: keyof typeof formData.incomes) => {
        setFormData(prev => ({
            ...prev,
            incomes: {
                ...prev.incomes,
                [sourceId]: !prev.incomes[sourceId],
            },
        }));
    };
    
    const selectedSources = useMemo(() => {
        return incomeSourcesList.filter(source => formData.incomes[source.id as keyof typeof formData.incomes]);
    }, [formData.incomes]);

    const handleContinueToForms = () => {
        if (selectedSources.length > 0) {
            setStage('forms');
        } else {
            // If no source is selected, maybe show a toast message or just proceed to the next main step.
            // For now, let's just proceed.
            onContinue();
        }
    }

    if (stage === 'selection') {
        return (
            <div>
                <div className="mb-6">
                    <CardTitle>{t({ en: "Income Sources", ur: "آمدنی کے ذرائع" })}</CardTitle>
                    <CardDescription>{t({ en: "Please select all applicable sources of your income for the tax year.", ur: "ٹیکس سال کے لیے براہ کرم اپنی آمدنی کے تمام قابل اطلاق ذرائع منتخب کریں۔" })}</CardDescription>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {incomeSourcesList.map((source) => {
                        const isSelected = formData.incomes[source.id as keyof typeof formData.incomes];
                        return (
                            <div
                                key={source.id}
                                onClick={() => toggleSource(source.id as keyof typeof formData.incomes)}
                                className={cn(
                                    "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                                    isSelected ? "border-primary bg-primary/10" : "border-transparent bg-muted/50 hover:bg-muted"
                                )}
                            >
                                <source.icon className={cn("h-10 w-10 mb-2", isSelected ? 'text-primary' : 'text-muted-foreground')} />
                                <span className={cn("text-sm font-medium text-center", isSelected ? 'text-primary' : 'text-foreground')}>{t(source.label)}</span>
                                {isSelected && (
                                    <CheckCircle className="h-5 w-5 text-white bg-primary rounded-full absolute -top-2 -right-2" />
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-end mt-8">
                     <Button onClick={handleContinueToForms}>
                        {t({ en: 'Continue', ur: 'جاری رکھیں' })}
                    </Button>
                </div>
            </div>
        );
    }
    
    // Stage 2: Forms
    return (
        <div>
            <div className="mb-6">
                <CardTitle>{t({ en: "Income Details", ur: "آمدنی کی تفصیلات" })}</CardTitle>
                <CardDescription>{t({ en: "Please provide the details for your selected income sources.", ur: "براہ کرم اپنی منتخب کردہ آمدنی کے ذرائع کے لیے تفصیلات فراہم کریں۔" })}</CardDescription>
            </div>
            
            <Tabs defaultValue={selectedSources[0].id} className="w-full">
                <TabsList>
                    {selectedSources.map(source => (
                        <TabsTrigger key={source.id} value={source.id}>
                            <source.icon className="h-4 w-4 mr-2" />
                            {t(source.label)}
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {selectedSources.map(source => (
                     <TabsContent key={source.id} value={source.id} className="p-4 border rounded-b-md">
                        {source.id === 'hasSalary' && <SalaryForm />}
                        {/* Add other form components here as they are created */}
                         {source.id !== 'hasSalary' && (
                            <p className="text-center text-muted-foreground py-8">
                                {t({ en: 'This form is under construction.', ur: 'یہ فارم زیر تعمیر ہے۔' })}
                            </p>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
            <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStage('selection')}>
                    {t({ en: 'Back to Selection', ur: 'انتخاب پر واپس جائیں' })}
                </Button>
                <Button onClick={onContinue}>
                    {t({ en: 'Next: Deductions', ur: 'اگلا: کٹوتی' })}
                </Button>
            </div>
        </div>
    );
}

