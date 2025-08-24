
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useEffect, useMemo, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { PieChart } from 'lucide-react';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Checkbox } from '../ui/checkbox';

const wrapUpSchema = z.object({
  reconciliationChoice: z.enum(['yes', 'no']).optional(),
  agreedToTerms: z.boolean().optional(),
});

type WrapUpFormData = z.infer<typeof wrapUpSchema>;

export function WrapUpStep({ setCurrentStep }: { setCurrentStep: (step: number) => void }) {
  const { t } = useLanguage();
  const { formData, setFormData } = usePersonalTaxFiling();
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const form = useForm<WrapUpFormData>({
    resolver: zodResolver(wrapUpSchema),
    defaultValues: formData.wrapUp,
  });

  const reconciliationChoice = form.watch('reconciliationChoice');

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

  useEffect(() => {
    if (reconciliationChoice === 'no') {
        // Navigate back to the 'expense' tab, which is at index 5
        setCurrentStep(5); 
        // Reset the choice so the user is prompted again if they come back
        form.reset({ ...form.getValues(), reconciliationChoice: undefined });
    }
  }, [reconciliationChoice, setCurrentStep, form]);


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
                <p className="mb-2">
                    {t({en: 'It seems that there’s a difference in your wealth reconciliation', ur: 'ایسا لگتا ہے کہ آپ کی دولت کی مفاہمت میں فرق ہے'})}
                    : <span className='font-bold font-mono text-lg'>{difference.toLocaleString()}</span>.
                </p>
                 <p className="mb-4 text-muted-foreground">
                    {t({en: 'Can we auto adjust the difference with your expense to reconcile the wealth statement?', ur: 'کیا ہم دولت کے گوشوارے کو مفاہمت کرنے کے لیے آپ کے اخراجات کے ساتھ فرق کو خودکار طور پر ایڈجسٹ کر سکتے ہیں؟'})}
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
                                <RadioGroupItem value="yes" id="adjust_yes" />
                                </FormControl>
                                <FormLabel htmlFor="adjust_yes" className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                <RadioGroupItem value="no" id="adjust_no" />
                                </FormControl>
                                <FormLabel htmlFor="adjust_no" className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                {reconciliationChoice === 'yes' && (
                     <div className="mt-6 animate-in fade-in-50">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button>{t({en: "Confirm Auto-Adjustment", ur: "خودکار ایڈجسٹمنٹ کی تصدیق کریں"})}</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>{t({en: "Terms and Conditions", ur: "شرائط و ضوابط"})}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t({en: "By checking this box, you authorize us to automatically adjust your declared expenses to fully reconcile your wealth statement. This adjustment is made for the purpose of tax filing and ensures that your reported wealth is consistent with your income and expenses.", ur: "اس باکس کو چیک کرکے، آپ ہمیں اپنے دولت کے گوشوارے کو مکمل طور پر مفاہمت کرنے کے لیے اپنے اعلان کردہ اخراجات کو خود بخود ایڈجسٹ کرنے کا اختیار دیتے ہیں۔ یہ ایڈجسٹمنٹ ٹیکس فائلنگ کے مقصد کے لیے کی گئی ہے اور یہ یقینی بناتی ہے کہ آپ کی رپورٹ کردہ دولت آپ کی آمدنی اور اخراجات کے مطابق ہے۔"})}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4">
                                     <FormField
                                        control={form.control}
                                        name="agreedToTerms"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>{t({en: 'I agree to the terms and conditions.', ur: 'میں شرائط و ضوابط سے اتفاق کرتا ہوں۔'})}</FormLabel>
                                            </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <AlertDialogFooter>
                                <AlertDialogCancel>{t({en: "Cancel", ur: "منسوخ کریں"})}</AlertDialogCancel>
                                <AlertDialogAction disabled={!form.watch('agreedToTerms')}>{t({en: "Accept", ur: "قبول کریں"})}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                     </div>
                )}
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
