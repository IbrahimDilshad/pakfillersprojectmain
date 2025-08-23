
'use client';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '../ui/separator';

const dividendTypes = [
    { id: 'dividendFromPower', label: { en: 'Dividend received from Power companies (taxed at 7.5%)', ur: 'پاور کمپنیوں سے موصول ہونے والا ڈیویڈنڈ (7.5% پر ٹیکس)' } },
    { id: 'dividendFromOther', label: { en: 'Dividend received from Other companies and stock funds (taxed at 15.0%)', ur: 'دیگر کمپنیوں اور اسٹاک فنڈز سے موصول ہونے والا ڈیویڈنڈ (15.0% پر ٹیکس)' } },
    { id: 'dividendFromNoTax', label: { en: 'Dividend from a company where no tax payable by such company (taxed at 25.0%)', ur: 'ایسی کمپنی سے ڈیویڈنڈ جہاں ایسی کمپنی کی طرف سے کوئی ٹیکس قابل ادائیگی نہیں (25.0% پر ٹیکس)' } },
];

export function DividendGainForm({ form: passedForm }: { form: any }) {
    const { t } = useLanguage();
    const { control } = useFormContext();

    return (
        <Form {...passedForm}>
            <div className="p-4 border rounded-md space-y-6">
                 <Tabs defaultValue="dividend" className="w-full">
                    <TabsList>
                        <TabsTrigger value="dividend">{t({en: 'Dividend', ur: 'ڈیویڈنڈ'})}</TabsTrigger>
                        <TabsTrigger value="capitalGain">{t({en: 'Capital Gain', ur: 'سرمایہ حاصل'})}</TabsTrigger>
                        <TabsTrigger value="bonus">{t({en: 'Bonus', ur: 'بونس'})}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dividend" className="pt-4">
                        <div className="space-y-6">
                             {dividendTypes.map((item, index) => (
                                <div key={item.id}>
                                    <h4 className="font-semibold mb-2">{t(item.label)}</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormField control={control} name={`dividendGain.${item.id}.amount`} render={({ field }) => (
                                            <FormItem><FormLabel>{t({en: 'Amount', ur: 'رقم'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                         <FormField control={control} name={`dividendGain.${item.id}.taxDeducted`} render={({ field }) => (
                                            <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                    </div>
                                    {index < dividendTypes.length - 1 && <Separator className="mt-6" />}
                                </div>
                             ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="capitalGain" className="pt-4">
                        <div className="space-y-4">
                             <FormField control={control} name="dividendGain.capitalGain.netCapitalGain" render={({ field }) => (
                                <FormItem><FormLabel>{t({en: 'Net Capital Gain', ur: 'خالص سرمایہ حاصل'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={control} name="dividendGain.capitalGain.cgtLiability" render={({ field }) => (
                                <FormItem><FormLabel>{t({en: 'Capital Gain Tax (CGT) Liability', ur: 'سرمایہ حاصل ٹیکس (سی جی ٹی) کی ذمہ داری'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={control} name="dividendGain.capitalGain.taxDeducted" render={({ field }) => (
                                <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={control} name="dividendGain.capitalGain.costOfShares" render={({ field }) => (
                                <FormItem><FormLabel>{t({en: 'Cost of Shares/Mutual Funds Held at June 30, 2025', ur: '30 جون 2025 کو منعقدہ حصص/میوچل فنڈز کی لاگت'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </TabsContent>
                    <TabsContent value="bonus" className="pt-4">
                         <div className="space-y-4">
                              <FormField control={control} name="dividendGain.bonus.bonusValue" render={({ field }) => (
                                <FormItem><FormLabel>{t({en: 'Enter the value of bonus share', ur: 'بونس شیئر کی قیمت درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={control} name="dividendGain.bonus.taxDeducted" render={({ field }) => (
                                <FormItem><FormLabel>{t({en: 'Enter the tax deducted by issuing company', ur: 'جاری کرنے والی کمپنی کی طرف سے کاٹے گئے ٹیکس کو درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                         </div>
                    </TabsContent>
                 </Tabs>
            </div>
        </Form>
    );
}
