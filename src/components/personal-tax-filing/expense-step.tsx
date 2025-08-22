
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

const expenseSchema = z.object({
  totalHouseholdExpense: z.coerce.number().min(0, { message: 'Expense must be a positive number.' }),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export function ExpenseStep() {
  const { t } = useLanguage();
  const { formData, setFormData } = usePersonalTaxFiling();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: formData.expense,
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(prev => ({ ...prev, expense: value as ExpenseFormData }));
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);


  return (
    <Form {...form}>
      <div className="space-y-6">
        <div>
          <CardTitle>{t({ en: 'Household Expenses', ur: 'گھریلو اخراجات' })}</CardTitle>
          <CardDescription className="mt-2">
            <p>
              {t({
                en: 'Please declare your total household expenses for the tax year.',
                ur: 'برائے مہربانی ٹیکس سال کے لیے اپنے کل گھریلو اخراجات کا اعلان کریں۔',
              })}
            </p>
          </CardDescription>
        </div>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="totalHouseholdExpense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t({ en: 'Total Household Expense (PKR)', ur: 'کل گھریلو اخراجات (PKR)' })}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 600000" {...field} />
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
