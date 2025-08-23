
'use client';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

export function TraderShopForm({ form: passedForm, businessType }: { form: any, businessType: string }) {
    const { t } = useLanguage();
    const { control, watch } = useFormContext(); // Use useFormContext if this is a child of a FormProvider

    const withholdingOption = watch(`businessDetails.${businessType}.withholdingOption`);
    const hasOtherAdjustableTaxes = watch(`businessDetails.${businessType}.hasOtherAdjustableTaxes`);
    
    const { fields: otherTaxFields, append: appendOtherTax, remove: removeOtherTax } = useFieldArray({
        control: control,
        name: `businessDetails.${businessType}.otherAdjustableTaxes`
    });

    const renderFullForm = () => (
        <div className="space-y-6">
             {/* Revenue Section (conditional) */}
            {withholdingOption === 'all' && (
                <div className="p-4 border rounded-lg space-y-4">
                     <h4 className="font-semibold text-md">{t({en: 'Revenue on which tax was deducted', ur: 'آمدنی جس پر ٹیکس کاٹا گیا'})}</h4>
                     <div className="grid md:grid-cols-3 gap-4">
                        <FormField control={control} name={`businessDetails.${businessType}.revenueWithTax.revenueAmount`} render={({ field }) => (
                           <FormItem><FormLabel>{t({en: 'Enter Amount', ur: 'رقم درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={control} name={`businessDetails.${businessType}.revenueWithTax.taxDeducted`} render={({ field }) => (
                           <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={control} name={`businessDetails.${businessType}.revenueWithTax.taxRate`} render={({ field }) => (
                           <FormItem><FormLabel>{t({en: 'Select Tax Rate', ur: 'ٹیکس کی شرح منتخب کریں'})}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Rate" /></SelectTrigger></FormControl><SelectContent>{[...Array(22)].map((_, i) => <SelectItem key={i} value={String(0.25 * (i + 1))}>{(0.25 * (i + 1)).toFixed(2)}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                     </div>
                </div>
            )}
             {withholdingOption === 'none' && (
                <div className="p-4 border rounded-lg space-y-4">
                     <h4 className="font-semibold text-md">{t({en: 'Revenue on which tax was not deducted', ur: 'آمدنی جس پر ٹیکس نہیں کاٹا گیا'})}</h4>
                     <FormField control={control} name={`businessDetails.${businessType}.revenueWithoutTax.revenueAmount`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Enter Amount', ur: 'رقم درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                     )}/>
                </div>
            )}
             {withholdingOption === 'some' && (
                <div className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-semibold text-md">{t({en: 'Revenue on which tax was deducted', ur: 'آمدنی جس پر ٹیکس کاٹا گیا'})}</h4>
                     <div className="grid md:grid-cols-3 gap-4">
                        <FormField control={control} name={`businessDetails.${businessType}.revenueWithTax.revenueAmount`} render={({ field }) => (
                           <FormItem><FormLabel>{t({en: 'Enter Amount', ur: 'رقم درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={control} name={`businessDetails.${businessType}.revenueWithTax.taxDeducted`} render={({ field }) => (
                           <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={control} name={`businessDetails.${businessType}.revenueWithTax.taxRate`} render={({ field }) => (
                           <FormItem><FormLabel>{t({en: 'Select Tax Rate', ur: 'ٹیکس کی شرح منتخب کریں'})}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Rate" /></SelectTrigger></FormControl><SelectContent>{[...Array(22)].map((_, i) => <SelectItem key={i} value={String(0.25 * (i + 1))}>{(0.25 * (i + 1)).toFixed(2)}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                     </div>
                     <Separator />
                     <h4 className="font-semibold text-md">{t({en: 'Revenue on which tax was not deducted', ur: 'آمدنی جس پر ٹیکس نہیں کاٹا گیا'})}</h4>
                     <FormField control={control} name={`businessDetails.${businessType}.revenueWithoutTax.revenueAmount`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Enter Amount', ur: 'رقم درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                     )}/>
                </div>
            )}
            
            {/* Total Expense Section */}
            <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold text-md">{t({en: 'Total Expense', ur: 'کل اخراجات'})}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={control} name={`businessDetails.${businessType}.directExpense`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Direct Expense', ur: 'براہ راست اخراجات'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={control} name={`businessDetails.${businessType}.indirectExpense`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Indirect Expense', ur: 'بالواسطہ اخراجات'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>

            {/* Balance Sheet Section */}
             <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold text-md">{t({en: 'Balance Sheet', ur: 'بیلنس شیٹ'})}</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={control} name={`businessDetails.${businessType}.totalAssets`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Total Assets', ur: 'کل اثاثے'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={control} name={`businessDetails.${businessType}.totalLiabilities`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Total Liabilities', ur: 'کل واجبات'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={control} name={`businessDetails.${businessType}.totalCapital`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Total Capital', ur: 'کل سرمایہ'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>

            {/* Other Adjustable Taxes Section */}
            <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold text-md">{t({en: 'Other adjustable taxes', ur: 'دیگر قابل ایڈجسٹ ٹیکس'})}</h4>
                <FormField control={control} name={`businessDetails.${businessType}.hasOtherAdjustableTaxes`} render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>{t({en: 'Are there any brought forward taxes, advance taxes paid or other withholding taxes against your business activity?', ur: 'کیا آپ کی کاروباری سرگرمی کے خلاف کوئی آگے لائے گئے ٹیکس، پیشگی ادا شدہ ٹیکس یا دیگر ود ہولڈنگ ٹیکس ہیں؟'})}</FormLabel>
                    <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id={`adj_yes_${businessType}`} /></FormControl><FormLabel htmlFor={`adj_yes_${businessType}`} className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id={`adj_no_${businessType}`} /></FormControl><FormLabel htmlFor={`adj_no_${businessType}`} className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel></FormItem></RadioGroup></FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
                {hasOtherAdjustableTaxes === 'yes' && (
                    <div className="space-y-4 pt-2 animate-in fade-in-50">
                        {otherTaxFields.map((field, index) => (
                             <div key={field.id} className="grid md:grid-cols-[1fr_auto_auto] gap-4 items-end">
                                <FormField control={control} name={`businessDetails.${businessType}.otherAdjustableTaxes.${index}.description`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Select Description', ur: 'تفصیل منتخب کریں'})}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="advance_tax">{t({en: 'Advance Tax U/S 147', ur: 'ایڈوانس ٹیکس U/S 147'})}</SelectItem><SelectItem value="purchase_retailer">{t({en: 'Purchase by Retailer', ur: 'ریٹیلر کی طرف سے خریداری'})}</SelectItem><SelectItem value="turnover_tax">{t({en: 'Adjustment of Earlier Turnover Tax Paid', ur: 'پہلے ادا شدہ ٹرن اوور ٹیکس کی ایڈجسٹمنٹ'})}</SelectItem><SelectItem value="electricity_commercial">{t({en: 'Electricity Bill (Commercial Use)', ur: 'بجلی کا بل (کمرشل استعمال)'})}</SelectItem><SelectItem value="electricity_industrial">{t({en: 'Electricity Bill (Industrial Use)', ur: 'بجلی کا بل (صنعتی استعمال)'})}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={control} name={`businessDetails.${businessType}.otherAdjustableTaxes.${index}.taxDeducted`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <Button type="button" variant="destructive" size="icon" onClick={() => removeOtherTax(index)}><Trash2 className="h-4 w-4" /></Button>
                             </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendOtherTax({})}><PlusCircle className="mr-2 h-4 w-4" />{t({en: 'Add Another Tax', ur: 'ایک اور ٹیکس شامل کریں'})}</Button>
                    </div>
                )}
            </div>
        </div>
    );


    return (
        <div className="mt-4 p-4 border rounded-md bg-muted/20 space-y-6">
            <h3 className="font-semibold">{t({en: 'Withholding Tax Status', ur: 'ود ہولڈنگ ٹیکس کی حیثیت'})}</h3>
            <p className="text-sm text-muted-foreground">{t({en: 'All of your applicable withholding tax was deducted by your clients or some clients did not deducted at all', ur: 'آپ کے تمام قابل اطلاق ود ہولڈنگ ٹیکس آپ کے کلائنٹس نے کاٹ لیے تھے یا کچھ کلائنٹس نے بالکل نہیں کاٹے'})}</p>
            
            <FormField
                control={control}
                name={`businessDetails.${businessType}.withholdingOption`}
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid md:grid-cols-3 gap-4">
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 cursor-pointer has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                <FormControl><RadioGroupItem value="all" /></FormControl>
                                <FormLabel className="font-normal w-full cursor-pointer">{t({en: 'All clients deducted withholding tax', ur: 'تمام کلائنٹس نے ود ہولڈنگ ٹیکس کاٹا'})}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 cursor-pointer has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                <FormControl><RadioGroupItem value="none" /></FormControl>
                                <FormLabel className="font-normal w-full cursor-pointer">{t({en: 'None of your clients deducted withholding tax', ur: 'آپ کے کسی بھی کلائنٹ نے ود ہولڈنگ ٹیکس نہیں کاٹا'})}</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 cursor-pointer has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                <FormControl><RadioGroupItem value="some" /></FormControl>
                                <FormLabel className="font-normal w-full cursor-pointer">{t({en: 'Not all, but some of your clients deducted withholding tax', ur: 'سب نہیں، لیکن آپ کے کچھ کلائنٹس نے ود ہولڈنگ ٹیکس کاٹا'})}</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {withholdingOption && (
                 <div className="animate-in fade-in-50">{renderFullForm()}</div>
            )}
           
        </div>
    )
}
