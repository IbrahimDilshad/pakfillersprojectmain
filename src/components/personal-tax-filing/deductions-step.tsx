
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useEffect } from 'react';

const deductionsSchema = z.object({
  zakat: z.coerce.number().optional(),
  donations: z.coerce.number().optional(),
  educationAllowance: z.coerce.number().optional(),
  pensionFund: z.coerce.number().optional(),
  hasTaxCredits: z.boolean().default(false).optional(),
});

type DeductionsFormData = z.infer<typeof deductionsSchema>;

export function DeductionsStep() {
  const { t } = useLanguage();
  const { formData, setFormData } = usePersonalTaxFiling();
  const form = useForm<DeductionsFormData>({
    resolver: zodResolver(deductionsSchema),
    defaultValues: formData.deductions,
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(prev => ({...prev, deductions: value as DeductionsFormData}));
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  return (
    <div>
      <div className="mb-6">
        <CardTitle>{t({ en: 'Deductions & Tax Credits', ur: 'کٹوتی اور ٹیکس کریڈٹ' })}</CardTitle>
        <CardDescription>{t({ en: 'Provide details about your tax deductions and any applicable tax credits.', ur: 'اپنی ٹیکس کٹوتیوں اور کسی بھی قابل اطلاق ٹیکس کریڈٹ کے بارے میں تفصیلات فراہم کریں۔' })}</CardDescription>
      </div>
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="zakat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Zakat (Wealth Deducted)', ur: 'زکوٰۃ (دولت سے کٹوتی)' })}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="donations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Donations to Approved Institutions', ur: 'منظور شدہ اداروں کو عطیات' })}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="educationAllowance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Children Education Allowance', ur: 'بچوں کا تعلیمی الاؤنس' })}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 60000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pensionFund"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Contribution to Pension Fund', ur: 'پنشن فنڈ میں شراکت' })}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasTaxCredits"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t({ en: 'Do you have other tax credits?', ur: 'کیا آپ کے پاس دیگر ٹیکس کریڈٹ ہیں؟' })}
                    </FormLabel>
                     <p className="text-sm text-muted-foreground">
                        {t({ en: 'e.g., investment in shares, health insurance etc. This will be handled by our team.', ur: 'مثلاً حصص میں سرمایہ کاری، ہیلتھ انشورنس وغیرہ۔ یہ ہماری ٹیم سنبھالے گی۔' })}
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
