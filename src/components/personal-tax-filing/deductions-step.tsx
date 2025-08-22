
'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { Button } from '../ui/button';
import { Landmark, Phone, Car, PlusCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';


const deductionCategories = [
  { id: 'bank', label: { en: 'Bank', ur: 'بینک' }, icon: Landmark },
  { id: 'utility', label: { en: 'Utility', ur: 'یوٹیلیٹی' }, icon: Phone },
  { id: 'vehicle', label: { en: 'Vehicle', ur: 'گاڑی' }, icon: Car },
  { id: 'other', label: { en: 'Other', ur: 'دیگر' }, icon: PlusCircle },
];

const bankSchema = z.object({
  transactionType: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  taxDeducted: z.coerce.number().optional(),
});

const vehicleSchema = z.object({
  activity: z.string().optional(),
  vehicleType: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxDeduction: z.coerce.number().optional(),
});

const utilitySchema = z.object({
  utilityType: z.string().optional(),
  consumerNumber: z.string().optional(),
  taxDeduction: z.coerce.number().optional(),
});

const otherSchema = z.object({
    propertyPurchase: z.boolean().default(false),
    propertySale: z.boolean().default(false),
    functionsGatherings: z.boolean().default(false),
    pensionWithdrawal: z.boolean().default(false),
});

const deductionsSchema = z.object({
  selectedCategories: z.record(z.boolean()),
  bank: z.array(bankSchema).optional(),
  vehicle: z.array(vehicleSchema).optional(),
  utility: z.array(utilitySchema).optional(),
  other: otherSchema.optional(),
});

type DeductionsFormData = z.infer<typeof deductionsSchema>;

export function DeductionsStep() {
    const { t } = useLanguage();
    const { formData, setFormData } = usePersonalTaxFiling();
    const [view, setView] = useState<'selection' | 'forms'>('selection');

    const form = useForm<DeductionsFormData>({
        resolver: zodResolver(deductionsSchema),
        defaultValues: formData.deductions || { selectedCategories: {} },
    });
    
    const selectedCategories = form.watch('selectedCategories');
    const enabledCategories = Object.keys(selectedCategories).filter(key => selectedCategories[key]);
    
    const { fields: bankFields, append: appendBank } = useFieldArray({ control: form.control, name: "bank" });
    const { fields: vehicleFields, append: appendVehicle } = useFieldArray({ control: form.control, name: "vehicle" });
    const { fields: utilityFields, append: appendUtility } = useFieldArray({ control: form.control, name: "utility" });

    useEffect(() => {
        const subscription = form.watch((value) => {
            setFormData(prev => ({...prev, deductions: value as DeductionsFormData}));
        });
        return () => subscription.unsubscribe();
    }, [form, setFormData]);
    
    const toggleCategory = (categoryId: string) => {
        const currentSelection = form.getValues(`selectedCategories.${categoryId}`);
        form.setValue(`selectedCategories.${categoryId}`, !currentSelection);
    };

    const handleContinue = () => {
        if (enabledCategories.length > 0) {
            setView('forms');
        } else {
           // Maybe show a toast message? For now, we just stay.
        }
    }

    const renderForms = () => (
        <div className='space-y-6'>
            <Tabs defaultValue={enabledCategories[0]} className="w-full">
                <TabsList>
                    {enabledCategories.map(cat => <TabsTrigger key={cat} value={cat}>{t({en: cat.charAt(0).toUpperCase() + cat.slice(1), ur: cat})}</TabsTrigger>)}
                </TabsList>

                {enabledCategories.includes('bank') && (
                    <TabsContent value="bank">
                       <h3 className="text-lg font-medium mb-2">{t({en: 'Bank Deductions', ur: 'بینک کٹوتیاں'})}</h3>
                        {bankFields.map((field, index) => (
                             <div key={field.id} className="grid md:grid-cols-4 gap-4 border p-4 rounded-lg mb-4">
                               <FormField control={form.control} name={`bank.${index}.transactionType`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Transaction Type', ur: 'ٹرانزیکشن کی قسم'})}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="credit-card">{t({en: 'Credit Card', ur: 'کریڈٹ کارڈ'})}</SelectItem><SelectItem value="cash">{t({en: 'Cash', ur: 'نقد'})}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name={`bank.${index}.bankName`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Bank Name', ur: 'بینک کا نام'})}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name={`bank.${index}.accountNumber`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Account Number', ur: 'اکاؤنٹ نمبر'})}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name={`bank.${index}.taxDeducted`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => appendBank({})}><PlusCircle className="mr-2 h-4 w-4" />{t({en: "Add Bank Transaction", ur: "بینک ٹرانزیکشن شامل کریں"})}</Button>
                    </TabsContent>
                )}
                 {enabledCategories.includes('vehicle') && (
                    <TabsContent value="vehicle">
                        <h3 className="text-lg font-medium mb-2">{t({en: 'Vehicle Deductions', ur: 'گاڑیوں کی کٹوتیاں'})}</h3>
                         {vehicleFields.map((field, index) => (
                             <div key={field.id} className="grid md:grid-cols-4 gap-4 border p-4 rounded-lg mb-4">
                                <FormField control={form.control} name={`vehicle.${index}.activity`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Activity', ur: 'سرگرمی'})}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="register">{t({en: 'Register', ur: 'رجسٹر'})}</SelectItem><SelectItem value="transfer">{t({en: 'Transfer', ur: 'منتقلی'})}</SelectItem><SelectItem value="sale">{t({en: 'Sale', ur: 'فروخت'})}</SelectItem><SelectItem value="vehicle-tax">{t({en: 'Vehicle Tax', ur: 'وہیکل ٹیکس'})}</SelectItem><SelectItem value="motor-tax">{t({en: 'Motor Tax', ur: 'موٹر ٹیکس'})}</SelectItem><SelectItem value="other">{t({en: 'Other', ur: 'دیگر'})}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name={`vehicle.${index}.vehicleType`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Vehicle Type', ur: 'گاڑی کی قسم'})}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="car">{t({en: 'Car', ur: 'کار'})}</SelectItem><SelectItem value="bike">{t({en: 'Bike', ur: 'موٹر سائیکل'})}</SelectItem><SelectItem value="jeep">{t({en: 'Jeep', ur: 'جیپ'})}</SelectItem><SelectItem value="rickshaw">{t({en: 'Rickshaw', ur: 'رکشہ'})}</SelectItem><SelectItem value="other">{t({en: 'Other', ur: 'دیگر'})}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name={`vehicle.${index}.registrationNumber`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Registration No.', ur: 'رجسٹریشن نمبر'})}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name={`vehicle.${index}.taxDeduction`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Tax Deduction', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             </div>
                         ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => appendVehicle({})}><PlusCircle className="mr-2 h-4 w-4" />{t({en: "Add Vehicle Entry", ur: "گاڑی کی انٹری شامل کریں"})}</Button>
                    </TabsContent>
                )}
                 {enabledCategories.includes('utility') && (
                    <TabsContent value="utility">
                        <h3 className="text-lg font-medium mb-2">{t({en: 'Utility Deductions', ur: 'یوٹیلیٹی کٹوتیاں'})}</h3>
                        {utilityFields.map((field, index) => (
                             <div key={field.id} className="grid md:grid-cols-3 gap-4 border p-4 rounded-lg mb-4">
                                 <FormField control={form.control} name={`utility.${index}.utilityType`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Utility Service Type', ur: 'یوٹیلیٹی سروس کی قسم'})}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="cellphone">{t({en: 'Cellphone', ur: 'سیل فون'})}</SelectItem><SelectItem value="telephone">{t({en: 'Telephone', ur: 'ٹیلی فون'})}</SelectItem><SelectItem value="internet">{t({en: 'Internet', ur: 'انٹرنیٹ'})}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name={`utility.${index}.consumerNumber`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Consumer/Reg. Number', ur: 'صارف/رجسٹریشن نمبر'})}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name={`utility.${index}.taxDeduction`} render={({ field }) => (
                                    <FormItem><FormLabel>{t({en: 'Tax Deduction', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => appendUtility({})}><PlusCircle className="mr-2 h-4 w-4" />{t({en: "Add Utility Bill", ur: "یوٹیلیٹی بل شامل کریں"})}</Button>
                    </TabsContent>
                )}
                {enabledCategories.includes('other') && (
                    <TabsContent value="other">
                        <h3 className="text-lg font-medium mb-2">{t({en: 'Other Deductions', ur: 'دیگر کٹوتیاں'})}</h3>
                        <div className="space-y-4">
                            <FormField control={form.control} name="other.propertyPurchase" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>{t({en: 'Tax paid at the time of property transaction - Purchase', ur: 'جائیداد کی خریداری کے وقت ادا کیا گیا ٹیکس'})}</FormLabel></div></FormItem>)}/>
                            <FormField control={form.control} name="other.propertySale" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>{t({en: 'Tax paid at the time of property transaction - Sale', ur: 'جائیداد کی فروخت کے وقت ادا کیا گیا ٹیکس'})}</FormLabel></div></FormItem>)}/>
                            <FormField control={form.control} name="other.functionsGatherings" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>{t({en: 'Tax deducted/collected on functions and gatherings', ur: 'تقریبات اور اجتماعات پر کٹوتی/جمع شدہ ٹیکس'})}</FormLabel></div></FormItem>)}/>
                            <FormField control={form.control} name="other.pensionWithdrawal" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>{t({en: 'Withdrawal of funds from Voluntary Pension Scheme', ur: 'رضاکارانہ پنشن اسکیم سے فنڈز کی واپسی'})}</FormLabel></div></FormItem>)}/>
                        </div>
                    </TabsContent>
                )}
            </Tabs>
            <Button variant="link" onClick={() => setView('selection')}>{t({en: 'Back to category selection', ur: 'کیٹیگری انتخاب پر واپس جائیں'})}</Button>
        </div>
    );

    const renderSelection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {deductionCategories.map((cat) => {
                    const isSelected = selectedCategories[cat.id];
                    return (
                        <div
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all h-32",
                                isSelected ? "border-primary bg-primary/10" : "border-transparent bg-muted/50 hover:bg-muted"
                            )}
                        >
                            <cat.icon className={cn("h-10 w-10 mb-2", isSelected ? 'text-primary' : 'text-muted-foreground')} />
                            <span className={cn("text-sm font-medium text-center", isSelected ? 'text-primary' : 'text-foreground')}>{t(cat.label)}</span>
                             {isSelected && <CheckCircle className="h-5 w-5 text-white bg-primary rounded-full absolute -top-2 -right-2" />}
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end">
                <Button onClick={handleContinue} disabled={enabledCategories.length === 0}>{t({en: 'Continue', ur: 'جاری رکھیں'})}</Button>
            </div>
        </div>
    );

    return (
        <Form {...form}>
        <div>
            <div className="mb-6">
                <CardTitle>{t({ en: 'Tax Deducted at Source', ur: 'ماخذ پر کٹوتی شدہ ٹیکس' })}</CardTitle>
                <CardDescription>{t({ en: 'Declare your deductions for the tax year.', ur: 'ٹیکس سال کے لیے اپنی کٹوتیوں کا اعلان کریں۔' })}</CardDescription>
            </div>
            {view === 'selection' ? renderSelection() : renderForms()}
        </div>
        </Form>
    );
}
