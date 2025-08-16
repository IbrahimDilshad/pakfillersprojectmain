
'use client';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useEffect } from 'react';

const salarySchema = z.object({
  annualSalary: z.coerce.number().optional(),
  taxDeducted: z.coerce.number().optional(),
});

type SalaryFormData = z.infer<typeof salarySchema>;

const incomeSourcesSchema = z.object({
  salary: salarySchema.optional(),
});

type IncomeSourcesFormData = z.infer<typeof incomeSourcesSchema>;

export function IncomeSourcesStep() {
    const { t } = useLanguage();
    const { formData, setFormData } = usePersonalTaxFiling();
    const form = useForm<IncomeSourcesFormData>({
        resolver: zodResolver(incomeSourcesSchema),
        defaultValues: formData.incomes,
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            setFormData(prev => ({...prev, incomes: value as IncomeSourcesFormData}));
        });
        return () => subscription.unsubscribe();
    }, [form, setFormData]);

    return (
        <div>
            <div className="mb-6">
                <CardTitle>{t({ en: "Income Sources", ur: "آمدنی کے ذرائع" })}</CardTitle>
                <CardDescription>{t({ en: "Please provide details about your income from various sources.", ur: "براہ کرم مختلف ذرائع سے اپنی آمدنی کی تفصیلات فراہم کریں۔" })}</CardDescription>
            </div>
             <Form {...form}>
                <form>
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="salary">
                            <AccordionTrigger className="text-lg font-medium">{t({ en: "Salary Income", ur: "تنخواہ سے آمدنی" })}</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid md:grid-cols-2 gap-6 p-2">
                                     <FormField
                                        control={form.control}
                                        name="salary.annualSalary"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>{t({ en: 'Annual Salary', ur: 'سالانہ تنخواہ' })}</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="PKR" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="salary.taxDeducted"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>{t({ en: 'Tax Deducted at Source', ur: 'ماخذ پر کٹوتی ٹیکس' })}</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="PKR" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="business">
                            <AccordionTrigger className="text-lg font-medium">{t({ en: "Business Income", ur: "کاروباری آمدنی" })}</AccordionTrigger>
                            <AccordionContent>
                                <div className="text-center text-muted-foreground py-10">
                                    <p>{t({ en: 'Business income form will be here. This feature is under construction.', ur: 'کاروباری آمدنی کا فارم یہاں ہوگا۔ یہ فیچر زیر تعمیر ہے۔' })}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        {/* Other income sources can be added here as AccordionItems */}
                    </Accordion>
                </form>
            </Form>
        </div>
    );
}
