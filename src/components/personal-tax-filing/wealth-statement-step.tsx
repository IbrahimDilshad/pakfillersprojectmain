
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const wealthStatementSchema = z.object({
  properties: z.coerce.number().optional(),
  bankAccounts: z.coerce.number().optional(),
  vehicles: z.coerce.number().optional(),
  cash: z.coerce.number().optional(),
  otherAssets: z.coerce.number().optional(),
  liabilities: z.coerce.number().optional(),
});

type WealthStatementFormData = z.infer<typeof wealthStatementSchema>;

export function WealthStatementStep() {
  const { t } = useLanguage();
  const form = useForm<WealthStatementFormData>({
    resolver: zodResolver(wealthStatementSchema),
  });

  return (
    <div>
      <div className="mb-6">
        <CardTitle>{t({ en: 'Wealth Statement', ur: 'دولت کا بیان' })}</CardTitle>
        <CardDescription>{t({ en: 'Declare your assets and liabilities for the tax year.', ur: 'ٹیکس سال کے لیے اپنے اثاثے اور واجبات کا اعلان کریں۔' })}</CardDescription>
      </div>
      <Form {...form}>
        <form className="space-y-4">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="assets">
              <AccordionTrigger className="text-lg font-medium">{t({ en: 'Assets', ur: 'اثاثے' })}</AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-6 p-2">
                   <FormField
                    control={form.control}
                    name="properties"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t({ en: 'Total Value of Properties', ur: 'جائیدادوں کی کل قیمت' })}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="PKR" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="bankAccounts"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t({ en: 'Total Bank Balance', ur: 'کل بینک بیلنس' })}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="PKR" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="vehicles"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t({ en: 'Total Value of Vehicles', ur: 'گاڑیوں کی کل قیمت' })}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="PKR" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="cash"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t({ en: 'Cash in Hand', ur: 'ہاتھ میں نقد' })}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="PKR" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="otherAssets"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                        <FormLabel>{t({ en: 'Other Assets (Jewellery, investments, etc.)', ur: 'دیگر اثاثے (زیورات، سرمایہ کاری، وغیرہ)' })}</FormLabel>
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
            <AccordionItem value="liabilities">
              <AccordionTrigger className="text-lg font-medium">{t({ en: 'Liabilities', ur: 'واجبات' })}</AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-6 p-2">
                     <FormField
                        control={form.control}
                        name="liabilities"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                            <FormLabel>{t({ en: 'Total Liabilities (Loans, etc.)', ur: 'کل واجبات (قرضے، وغیرہ)' })}</FormLabel>
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
          </Accordion>
        </form>
      </Form>
    </div>
  );
}
