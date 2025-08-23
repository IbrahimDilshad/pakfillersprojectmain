
'use client';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const HoldingPeriodForm = ({ basePath }: { basePath: string }) => {
    const { t } = useLanguage();
    const { control } = useFormContext();
    return (
        <div className="grid md:grid-cols-3 gap-4 border p-4 rounded-md mt-4 animate-in fade-in-50">
            <FormField control={control} name={`${basePath}.purchaseCost`} render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Purchase Cost', ur: 'خریداری کی قیمت'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={control} name={`${basePath}.saleValue`} render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Sale Value', ur: 'فروخت کی قیمت'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={control} name={`${basePath}.location`} render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Location/Address', ur: 'مقام/پتہ'})}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
    );
};

const openPlotHoldingPeriods = [
    { value: 'within_1_year', label: { en: 'Purchased and sold within July 1, 2024 to June 30, 2025', ur: '1 جولائی 2024 سے 30 جون 2025 کے اندر خریدا اور بیچا' } },
    { value: '1_to_2_years', label: { en: 'Holding period is more than one year but less than two year', ur: 'مدت ایک سال سے زیادہ لیکن دو سال سے کم ہے' } },
    { value: '2_to_3_years', label: { en: 'Holding period is more than two years but less than three years', ur: 'مدت دو سال سے زیادہ لیکن تین سال سے کم ہے' } },
    { value: '3_to_4_years', label: { en: 'Holding period is more than three years but less than four years', ur: 'مدت تین سال سے زیادہ لیکن چار سال سے کم ہے' } },
    { value: '4_to_5_years', label: { en: 'Holding period is more than four years but less than five years', ur: 'مدت چار سال سے زیادہ لیکن پانچ سال سے کم ہے' } },
    { value: '5_to_6_years', label: { en: 'Holding period is more than five years but less than six years', ur: 'مدت پانچ سال سے زیادہ لیکن چھ سال سے کم ہے' } },
    { value: 'over_6_years', label: { en: 'Holding period is more than six years', ur: 'مدت چھ سال سے زیادہ ہے' } },
];

const constructedPlotHoldingPeriods = [
    { value: 'under_1_year', label: { en: 'Holding period does not exceed one year', ur: 'مدت ایک سال سے زیادہ نہیں ہے' } },
    { value: '1_to_2_years', label: { en: 'Holding period is more than one year but less than two years', ur: 'مدت ایک سال سے زیادہ لیکن دو سال سے کم ہے' } },
    { value: '2_to_3_years', label: { en: 'Holding period is more than two years but less than three years', ur: 'مدت دو سال سے زیادہ لیکن تین سال سے کم ہے' } },
    { value: '3_to_4_years', label: { en: 'Holding period is more than three years but less than four years', ur: 'مدت تین سال سے زیادہ لیکن چار سال سے کم ہے' } },
    { value: 'over_4_years', label: { en: 'Holding period is more than four years', ur: 'مدت چار سال سے زیادہ ہے' } },
];

const flatHoldingPeriods = [
    { value: 'under_1_year', label: { en: 'Holding period does not exceed one year', ur: 'مدت ایک سال سے زیادہ نہیں ہے' } },
    { value: '1_to_2_years', label: { en: 'Holding period is more than one year but less than two years', ur: 'مدت ایک سال سے زیادہ لیکن دو سال سے کم ہے' } },
    { value: 'over_2_years', label: { en: 'Holding period is more than two years', ur: 'مدت دو سال سے زیادہ ہے' } },
];

export function RentPropertyForm({ form: passedForm }: { form: any }) {
    const { t } = useLanguage();
    const { control, watch } = useFormContext();

    const tenantTaxDeduction = watch('rentAndProperty.tenantTaxDeduction');
    const hasGainOnSale = watch('rentAndProperty.hasGainOnSale');
    const propertyType = watch('rentAndProperty.propertyType');
    const openPlotHoldingPeriod = watch('rentAndProperty.openPlotHoldingPeriod');
    const constructedPlotHoldingPeriod = watch('rentAndProperty.constructedPlotHoldingPeriod');
    const flatHoldingPeriod = watch('rentAndProperty.flatHoldingPeriod');

    return (
        <Form {...passedForm}>
            <div className="p-4 border rounded-md space-y-6">
                <Tabs defaultValue="rent" className="w-full">
                    <TabsList>
                        <TabsTrigger value="rent">{t({en: 'Property Rent', ur: 'جائیداد کا کرایہ'})}</TabsTrigger>
                        <TabsTrigger value="gain">{t({en: 'Gain on Sales of Property', ur: 'جائیداد کی فروخت پر فائدہ'})}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rent" className="pt-4">
                        <div className="space-y-6">
                            <FormField control={control} name="rentAndProperty.rentReceived" render={({ field }) => (
                                <FormItem><FormLabel>{t({en: 'Please enter the rent received from your property during the year', ur: 'براہ کرم سال کے دوران اپنی جائیداد سے موصول ہونے والا کرایہ درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={control} name="rentAndProperty.rentExpense" render={({ field }) => (
                                <FormItem><FormLabel>{t({en: 'Please enter the rent expense during the year', ur: 'براہ کرم سال کے دوران کرایہ کا خرچ درج کریں'})}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={control} name="rentAndProperty.tenantTaxDeduction" render={({ field }) => (
                                <FormItem className="space-y-3"><FormLabel>{t({en: 'Did your tenant deduct any tax on your rent?', ur: 'کیا آپ کے کرایہ دار نے آپ کے کرایہ پر کوئی ٹیکس کاٹا؟'})}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="rent_tax_yes" /></FormControl><FormLabel htmlFor="rent_tax_yes" className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="rent_tax_no" /></FormControl><FormLabel htmlFor="rent_tax_no" className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                            )}/>
                            {tenantTaxDeduction === 'yes' && (
                                <div className="pl-4 animate-in fade-in-50">
                                    <FormField control={control} name="rentAndProperty.taxDeductedAmount" render={({ field }) => (
                                        <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="gain" className="pt-4">
                       <FormField control={control} name="rentAndProperty.hasGainOnSale" render={({ field }) => (
                            <FormItem className="space-y-3"><FormLabel>{t({en: 'Did you have any gain on sales of property?', ur: 'کیا آپ کو جائیداد کی فروخت پر کوئی فائدہ ہوا؟'})}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="gain_yes" /></FormControl><FormLabel htmlFor="gain_yes" className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="gain_no" /></FormControl><FormLabel htmlFor="gain_no" className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                        )}/>
                        {hasGainOnSale === 'yes' && (
                            <div className="pt-4 animate-in fade-in-50">
                                 <Tabs defaultValue="openPlot" className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="openPlot">{t({en: 'Open Plot', ur: 'کھلا پلاٹ'})}</TabsTrigger>
                                        <TabsTrigger value="constructedPlot">{t({en: 'Constructed Plot', ur: 'تعمیر شدہ پلاٹ'})}</TabsTrigger>
                                        <TabsTrigger value="flat">{t({en: 'Flat', ur: 'فلیٹ'})}</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="openPlot" className="pt-4">
                                        <FormField control={control} name="rentAndProperty.openPlotHoldingPeriod" render={({ field }) => (
                                            <FormItem className="space-y-3"><FormLabel>{t({en: 'Select Holding Period', ur: 'ہولڈنگ کی مدت منتخب کریں'})}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">{openPlotHoldingPeriods.map(p => (<FormItem key={p.value} className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value={p.value} /></FormControl><FormLabel className="font-normal">{t(p.label)}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        {openPlotHoldingPeriod && <HoldingPeriodForm basePath="rentAndProperty.openPlotDetails" />}
                                    </TabsContent>
                                    <TabsContent value="constructedPlot" className="pt-4">
                                         <FormField control={control} name="rentAndProperty.constructedPlotHoldingPeriod" render={({ field }) => (
                                            <FormItem className="space-y-3"><FormLabel>{t({en: 'Select Holding Period', ur: 'ہولڈنگ کی مدت منتخب کریں'})}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">{constructedPlotHoldingPeriods.map(p => (<FormItem key={p.value} className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value={p.value} /></FormControl><FormLabel className="font-normal">{t(p.label)}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        {constructedPlotHoldingPeriod && <HoldingPeriodForm basePath="rentAndProperty.constructedPlotDetails" />}
                                    </TabsContent>
                                    <TabsContent value="flat" className="pt-4">
                                         <FormField control={control} name="rentAndProperty.flatHoldingPeriod" render={({ field }) => (
                                            <FormItem className="space-y-3"><FormLabel>{t({en: 'Select Holding Period', ur: 'ہولڈنگ کی مدت منتخب کریں'})}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">{flatHoldingPeriods.map(p => (<FormItem key={p.value} className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value={p.value} /></FormControl><FormLabel className="font-normal">{t(p.label)}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        {flatHoldingPeriod && <HoldingPeriodForm basePath="rentAndProperty.flatDetails" />}
                                    </TabsContent>
                                 </Tabs>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </Form>
    );
}
