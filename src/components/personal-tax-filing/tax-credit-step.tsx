
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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const taxCreditSchema = z.object({
  qualifyForRebates: z.enum(['yes', 'no']).optional(),
  hasDonations: z.boolean().default(false),
  donationAmount: z.coerce.number().optional(),
  hasTuitionFee: z.boolean().default(false),
  numberOfChildren: z.coerce.number().optional(),
  tuitionFeeAmount: z.coerce.number().optional(),
});

type TaxCreditFormData = z.infer<typeof taxCreditSchema>;

export function TaxCreditStep() {
  const { t } = useLanguage();
  const { formData, setFormData } = usePersonalTaxFiling();
  
  const form = useForm<TaxCreditFormData>({
    resolver: zodResolver(taxCreditSchema),
    defaultValues: formData.taxCredit,
  });

  const qualifyForRebates = form.watch('qualifyForRebates');
  const hasDonations = form.watch('hasDonations');
  const hasTuitionFee = form.watch('hasTuitionFee');

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(prev => ({...prev, taxCredit: value as TaxCreditFormData}));
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  return (
    <div>
      <div className="mb-6">
        <CardTitle>{t({ en: 'Tax Credit', ur: 'ٹیکس کریڈٹ' })}</CardTitle>
        <CardDescription>{t({ en: 'Answer the questions to see if you qualify for tax rebates.', ur: 'یہ دیکھنے کے لیے سوالات کے جواب دیں کہ کیا آپ ٹیکس چھوٹ کے لیے اہل ہیں' })}</CardDescription>
      </div>
      <Form {...form}>
        <form className="space-y-6">
            <FormField
                control={form.control}
                name="qualifyForRebates"
                render={({ field }) => (
                    <FormItem className="space-y-3 p-4 border rounded-lg">
                    <FormLabel className="font-semibold">{t({en: 'Did you make investment in mutual funds, insurance, or donated any amount to charitable organization?', ur: 'کیا آپ نے میوچل فنڈز، انشورنس میں سرمایہ کاری کی، یا کسی خیراتی ادارے کو کوئی رقم عطیہ کی؟'})}</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        >
                        <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="yes" id="rebate_yes" /></FormControl>
                            <FormLabel htmlFor="rebate_yes" className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="no" id="rebate_no" /></FormControl>
                            <FormLabel htmlFor="rebate_no" className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {qualifyForRebates === 'yes' && (
                <div className="space-y-6 animate-in fade-in-50 pl-4 border-l-2">
                    <FormField
                        control={form.control}
                        name="hasDonations"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>{t({en: 'Have you given any donations through crossed cheque to any approved charity institutions?', ur: 'کیا آپ نے کسی منظور شدہ خیراتی ادارے کو کراسڈ چیک کے ذریعے کوئی عطیہ دیا ہے؟'})}</FormLabel>
                            </div>
                            </FormItem>
                        )}
                    />
                    {hasDonations && (
                         <div className="pl-8 animate-in fade-in-50">
                             <FormField
                                control={form.control}
                                name="donationAmount"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t({ en: 'Enter donation amount', ur: 'عطیہ کی رقم درج کریں' })}</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="PKR" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                         </div>
                    )}
                    <FormField
                        control={form.control}
                        name="hasTuitionFee"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>{t({en: 'Did you pay tuition fee for your children education?', ur: 'کیا آپ نے اپنے بچوں کی تعلیم کے لیے ٹیوشن فیس ادا کی؟'})}</FormLabel>
                            </div>
                            </FormItem>
                        )}
                    />
                     {hasTuitionFee && (
                         <div className="pl-8 space-y-4 animate-in fade-in-50">
                             <FormField
                                control={form.control}
                                name="numberOfChildren"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t({ en: 'How many children do you have?', ur: 'آپ کے کتنے بچے ہیں؟' })}</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder={t({en: 'e.g., 2', ur: 'مثلاً 2'})} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="tuitionFeeAmount"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t({ en: 'How much tuition fee did you pay?', ur: 'آپ نے کتنی ٹیوشن فیس ادا کی؟' })}</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="PKR" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                         </div>
                    )}
                </div>
            )}
        </form>
      </Form>
    </div>
  );
}
