
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useEffect, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { PieChart } from 'lucide-react';

const wrapUpSchema = z.object({
  reconciliationChoice: z.enum(['auto', 'manual']).optional(),
});

type WrapUpFormData = z.infer<typeof wrapUpSchema>;

export function WrapUpStep() {
  const { t } = useLanguage();
  const { formData, setFormData } = usePersonalTaxFiling();

  const form = useForm<WrapUpFormData>({
    resolver: zodResolver(wrapUpSchema),
    defaultValues: formData.wrapUp,
  });
  
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(prev => ({ ...prev, wrapUp: value as WrapUpFormData }));
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  const { difference } = useMemo(() => {
      const totalIncome = (formData.incomes?.salary?.annualSalary || 0);
      const taxPaid = formData.incomes?.salary?.taxDeducted || 0;
      const openingWealth = formData.wealthStatement?.openingWealth || 0;
      const expenses = formData.expense?.totalHouseholdExpense || 0;
      const closingWealth = (openingWealth + totalIncome) - expenses - taxPaid;
      // In a real scenario, this would be calculated from an assets step. Placeholder for now.
      const assetsAtClosing = closingWealth;
      const difference = closingWealth - assetsAtClosing;
      return { difference };
  }, [formData]);


  return (
    <Form {...form}>
      <div className="space-y-6">
        <div>
          <CardTitle>{t({ en: 'Wrap Up', ur: 'نتیجہ' })}</CardTitle>
          <CardDescription className="mt-2">
            {t({
              en: 'Final reconciliation of your wealth statement.',
              ur: 'آپ کے دولت کے گوشوارے کا حتمی مفاہمت۔',
            })}
          </CardDescription>
        </div>
        
        {difference !== 0 && (
            <div className='flex flex-col items-center justify-center text-center p-6 border rounded-lg bg-muted/50'>
                <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <PieChart className="h-10 w-10" />
                </div>
                <p className="mb-4">
                    {t({en: 'It seems that there’s a difference in your wealth reconciliation', ur: 'ایسا لگتا ہے کہ آپ کی دولت کی مفاہمت میں فرق ہے'})}
                    (<span className='font-bold font-mono'>{difference.toLocaleString()}</span>).
                </p>
                 <p className="mb-4 text-muted-foreground">
                    {t({en: 'Auto adjust with difference with your opening wealth to reconcile the wealth statement', ur: 'دولت کے گوشوارے کو مفاہمت کرنے کے لیے اپنی ابتدائی دولت کے ساتھ فرق کو خودکار طور پر ایڈجسٹ کریں۔'})}
                </p>

                <FormField
                    control={form.control}
                    name="reconciliationChoice"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                            >
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                <RadioGroupItem value="auto" id="auto" />
                                </FormControl>
                                <FormLabel htmlFor="auto" className="font-normal">{t({en: 'Auto adjust in opening wealth', ur: 'ابتدائی دولت میں خودکار ایڈجسٹمنٹ'})}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                <RadioGroupItem value="manual" id="manual" />
                                </FormControl>
                                <FormLabel htmlFor="manual" className="font-normal">{t({en: 'I will adjust it myself', ur: 'میں خود ایڈجسٹ کروں گا'})}</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        )}

        {difference === 0 && (
            <div className="text-center p-6 border rounded-lg">
                <p className="text-lg text-muted-foreground">{t({en: 'Your wealth statement is reconciled.', ur: 'آپ کا دولت کا گوشوارہ مفاہمت کر لیا گیا ہے۔'})}</p>
            </div>
        )}
      </div>
    </Form>
  );
}
