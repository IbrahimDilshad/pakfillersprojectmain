
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useEffect } from 'react';

const wealthStatementSchema = z.object({
  openingWealth: z.coerce.number().min(0, { message: 'Wealth must be a positive number.' }),
});

type WealthStatementFormData = z.infer<typeof wealthStatementSchema>;

export function WealthStatementStep() {
  const { t } = useLanguage();
  const { formData, setFormData } = usePersonalTaxFiling();

  const form = useForm<WealthStatementFormData>({
    resolver: zodResolver(wealthStatementSchema),
    defaultValues: formData.wealthStatement,
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(prev => ({ ...prev, wealthStatement: value as WealthStatementFormData }));
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  const taxYear = formData.taxYear ? parseInt(formData.taxYear) : new Date().getFullYear();
  const prevTaxYear = taxYear - 1;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div>
          <CardTitle>{t({ en: 'Wealth Reconciliation', ur: 'دولت کا مفاہمت' })}</CardTitle>
          <CardDescription className="mt-2 space-y-2">
            <p>
              {t({
                en: `For your Wealth Reconciliation, we need to determine your wealth at the beginning of the tax year ${taxYear}.`,
                ur: `آپ کی دولت کی مفاہمت کے لیے، ہمیں ٹیکس سال ${taxYear} کے آغاز میں آپ کی دولت کا تعین کرنے کی ضرورت ہے۔`,
              })}
            </p>
            <p>
              {t({
                en: `Please enter your total wealth as at July 1, ${prevTaxYear}, which is closing wealth of your wealth statement for the tax year ${prevTaxYear}.`,
                ur: `برائے مہربانی 1 جولائی، ${prevTaxYear} تک اپنی کل دولت درج کریں، جو کہ ٹیکس سال ${prevTaxYear} کے لیے آپ کے دولت کے گوشوارے کی اختتامی دولت ہے۔`,
              })}
            </p>
          </CardDescription>
        </div>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="openingWealth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t({ en: 'Total Wealth (PKR)', ur: 'کل دولت (PKR)' })}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 5000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </div>
    </Form>
  );
}
