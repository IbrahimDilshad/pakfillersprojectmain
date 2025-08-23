
'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { Briefcase, Building2, User, Laptop, GraduationCap, Landmark, Tractor, Percent, Cog, Users, Home, PiggyBank, AreaChart, TrendingUp, PlusCircle, CheckCircle, Store, Car, Handshake, Factory, Ship, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TraderShopForm } from './trader-shop-form';
import { FreelancerForm } from './freelancer-form';
import { ProfessionalForm } from './professional-form';

const incomeSourcesList = [
  { id: 'hasSalary', label: { en: 'Salary', ur: 'تنخواہ' }, icon: Briefcase },
  { id: 'hasBusiness', label: { en: 'Business', ur: 'کاروبار' }, icon: Building2 },
  { id: 'hasFreelancer', label: { en: 'Freelancer', ur: 'فری لانسر' }, icon: Laptop },
  { id: 'hasProfessional', label: { en: 'Professional', ur: 'پیشہ ور' }, icon: GraduationCap },
  { id: 'hasPension', label: { en: 'Pension', ur: 'پنشن' }, icon: Landmark },
  { id: 'hasAgriculture', label: { en: 'Agriculture', ur: 'زراعت' }, icon: Tractor },
  { id: 'hasCommission', label: { en: 'Commission', ur: 'کمیشن' }, icon: Percent },
  { id: 'hasServices', label: { en: 'Services', ur: 'خدمات' }, icon: Cog },
  { id: 'hasPartnership', label: { en: 'Partnership/AOP', ur: 'شراکت/اے او پی' }, icon: Users },
  { id: 'hasRent', label: { en: 'Rent/Property Sale', ur: 'کرایہ/جائیداد فروخت' }, icon: Home },
  { id: 'hasSavingsProfit', label: { en: 'Profit on Savings', ur: 'بچت پر منافع' }, icon: PiggyBank },
  { id: 'hasDividend', label: { en: 'Dividend', ur: 'منافع' }, icon: AreaChart },
  { id: 'hasGain', label: { en: 'Gain', ur: 'فائدہ' }, icon: TrendingUp },
  { id: 'hasOther', label: { en: 'Other Income', ur: 'دیگر آمدنی' }, icon: PlusCircle },
];

const businessTypesList = [
    { id: 'trader', label: { en: 'Trader/Shop', ur: 'تاجر/دکان' }, icon: Store },
    { id: 'dealers', label: { en: 'Dealers', ur: 'ڈیلرز' }, icon: Car },
    { id: 'wholesale', label: { en: 'Wholesale/Supplier', ur: 'تھوک/سپلائر' }, icon: Handshake },
    { id: 'manufacturer', label: { en: 'Manufacturer', ur: 'مینوفیکچرر' }, icon: Factory },
    { id: 'imports', label: { en: 'Imports', ur: 'درآمدات' }, icon: Ship },
    { id: 'exports', label: { en: 'Exports', ur: 'برآمدات' }, icon: Plane },
];

const salarySchema = z.object({
  annualSalary: z.coerce.number().optional(),
  taxDeducted: z.coerce.number().optional(),
});

const businessSubFormSchema = z.object({
    withholdingOption: z.enum(['all', 'none', 'some']).optional(),
    revenueWithTax: z.object({ revenueAmount: z.coerce.number().optional(), taxDeducted: z.coerce.number().optional(), taxRate: z.string().optional() }).optional(),
    revenueWithoutTax: z.object({ revenueAmount: z.coerce.number().optional() }).optional(),
    directExpense: z.coerce.number().optional(),
    indirectExpense: z.coerce.number().optional(),
    totalAssets: z.coerce.number().optional(),
    totalLiabilities: z.coerce.number().optional(),
    totalCapital: z.coerce.number().optional(),
    hasOtherAdjustableTaxes: z.enum(['yes', 'no']).optional(),
    otherAdjustableTaxes: z.array(z.object({ description: z.string().optional(), taxDeducted: z.coerce.number().optional() })).optional(),
});

const freelancerSubFormSchema = businessSubFormSchema.extend({
    incomeFromAbroad: z.enum(['yes', 'no']).optional(),
    isPsebRegistered: z.enum(['yes', 'no']).optional(),
});

const professionalSubFormSchema = businessSubFormSchema.extend({
    professionType: z.string().optional(),
});

const pensionSchema = z.object({
    amount: z.coerce.number().optional(),
});

const agricultureSchema = z.object({
    amount: z.coerce.number().optional(),
});


const incomesSchema = z.object({
  hasSalary: z.boolean().optional(),
  salary: salarySchema.optional(),
  hasBusiness: z.boolean().optional(),
  business: z.record(z.boolean()).optional(), // To store selected business types
  businessDetails: z.record(businessSubFormSchema).optional(), // To store the form data for each business type
  hasFreelancer: z.boolean().optional(),
  freelancer: freelancerSubFormSchema.optional(),
  hasProfessional: z.boolean().optional(),
  professional: professionalSubFormSchema.optional(),
  hasPension: z.boolean().optional(),
  pension: pensionSchema.optional(),
  hasAgriculture: z.boolean().optional(),
  agriculture: agricultureSchema.optional(),
});

type IncomesFormData = z.infer<typeof incomesSchema>;

export function IncomeSourcesStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { t } = useLanguage();
    const { formData, setFormData } = usePersonalTaxFiling();
    const [view, setView] = useState<'selection' | 'forms'>('selection');

    const form = useForm<IncomesFormData>({
        resolver: zodResolver(incomesSchema),
        defaultValues: formData.incomes || {},
    });

    const selectedSources = form.watch();
    const enabledSources = Object.keys(selectedSources).filter(key => key.startsWith('has') && selectedSources[key as keyof typeof selectedSources]);
    const enabledSourceIds = enabledSources.map(s => s.replace('has', '').toLowerCase());
    
    const selectedBusinessTypes = selectedSources.business || {};
    const enabledBusinessTypes = Object.keys(selectedBusinessTypes).filter(key => selectedBusinessTypes[key]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            setFormData(prev => ({ ...prev, incomes: value as IncomesFormData }));
        });
        return () => subscription.unsubscribe();
    }, [form, setFormData]);

    const toggleSource = (sourceId: keyof IncomesFormData) => {
        const currentSelection = form.getValues(sourceId);
        form.setValue(sourceId, !currentSelection);
    };

    const toggleBusinessType = (businessTypeId: string) => {
        const currentSelection = form.getValues(`business.${businessTypeId}`);
        form.setValue(`business.${businessTypeId}`, !currentSelection);
    }

    const handleContinue = () => {
        if (enabledSources.length > 0) {
            setView('forms');
        } else {
           onNext(); // Or show a toast, for now, just proceed
        }
    }
    
    const renderSourceSelection = () => (
         <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {incomeSourcesList.map((source) => {
                    const isSelected = selectedSources[source.id as keyof IncomesFormData];
                    return (
                        <div
                            key={source.id}
                            onClick={() => toggleSource(source.id as keyof IncomesFormData)}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all h-32",
                                isSelected ? "border-primary bg-primary/10" : "border-transparent bg-muted/50 hover:bg-muted"
                            )}
                        >
                            <source.icon className={cn("h-10 w-10 mb-2", isSelected ? 'text-primary' : 'text-muted-foreground')} />
                            <span className={cn("text-sm font-medium text-center", isSelected ? 'text-primary' : 'text-foreground')}>{t(source.label)}</span>
                            {isSelected && <CheckCircle className="h-5 w-5 text-white bg-primary rounded-full absolute -top-2 -right-2" />}
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-between mt-6">
                <Button onClick={onBack} variant="outline">{t({ en: 'Back', ur: 'پیچھے' })}</Button>
                <Button onClick={handleContinue}>{t({ en: 'Continue', ur: 'جاری رکھیں' })}</Button>
            </div>
        </div>
    );
    
    const renderForms = () => (
        <div className="space-y-6">
             <Form {...form}>
                <Tabs defaultValue={enabledSourceIds[0]} className="w-full">
                    <TabsList>
                        {enabledSourceIds.map(id => <TabsTrigger key={id} value={id}>{t({en: id.charAt(0).toUpperCase() + id.slice(1), ur: id})}</TabsTrigger>)}
                    </TabsList>
                    
                    {enabledSourceIds.includes('salary') && (
                        <TabsContent value="salary">
                             <div className="p-4 border rounded-md">
                                <h3 className="text-lg font-medium mb-4">{t({en: 'Salary Details', ur: 'تنخواہ کی تفصیلات'})}</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                     <FormField control={form.control} name="salary.annualSalary" render={({ field }) => (
                                        <FormItem><FormLabel>{t({en: 'Annual Salary', ur: 'سالانہ تنخواہ'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="salary.taxDeducted" render={({ field }) => (
                                        <FormItem><FormLabel>{t({en: 'Tax Deducted by Employer', ur: 'آجر کی طرف سے کٹوتی شدہ ٹیکس'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                            </div>
                        </TabsContent>
                    )}
                     {enabledSourceIds.includes('freelancer') && (
                        <TabsContent value="freelancer">
                             <FreelancerForm form={form} />
                        </TabsContent>
                    )}
                    {enabledSourceIds.includes('business') && (
                        <TabsContent value="business">
                            <div className="p-4 border rounded-md">
                                <h3 className="text-lg font-medium mb-4">{t({en: 'Select Business Type(s)', ur: 'کاروبار کی قسم منتخب کریں'})}</h3>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                     {businessTypesList.map((business) => {
                                        const isSelected = selectedSources.business?.[business.id];
                                        return (
                                             <div key={business.id} onClick={() => toggleBusinessType(business.id)} className={cn( "relative flex flex-col items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all h-28", isSelected ? "border-primary bg-primary/10" : "border-transparent bg-muted/50 hover:bg-muted" )}>
                                                <business.icon className={cn("h-8 w-8 mb-2", isSelected ? 'text-primary' : 'text-muted-foreground')} />
                                                <span className={cn("text-xs font-medium text-center", isSelected ? 'text-primary' : 'text-foreground')}>{t(business.label)}</span>
                                                {isSelected && <CheckCircle className="h-4 w-4 text-white bg-primary rounded-full absolute -top-1 -right-1" />}
                                            </div>
                                        )
                                     })}
                                 </div>
                                  {enabledBusinessTypes.length > 0 && (
                                    <Tabs defaultValue={enabledBusinessTypes[0]} className="w-full mt-6">
                                        <TabsList>
                                            {enabledBusinessTypes.map(id => <TabsTrigger key={id} value={id}>{t({en: id.charAt(0).toUpperCase() + id.slice(1), ur: id})}</TabsTrigger>)}
                                        </TabsList>
                                        {enabledBusinessTypes.map(type => (
                                            <TabsContent key={type} value={type}>
                                                <TraderShopForm form={form} businessType={type} />
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                  )}
                            </div>
                        </TabsContent>
                    )}
                     {enabledSourceIds.includes('professional') && (
                        <TabsContent value="professional">
                             <ProfessionalForm form={form} />
                        </TabsContent>
                    )}
                     {enabledSourceIds.includes('pension') && (
                        <TabsContent value="pension">
                            <div className="p-4 border rounded-md">
                                <h3 className="text-lg font-medium mb-4">{t({en: 'Pension Income', ur: 'پنشن کی آمدنی'})}</h3>
                                <FormField control={form.control} name="pension.amount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t({en: 'Enter Total Pension Received During The Year', ur: 'سال کے دوران موصول ہونے والی کل پنشن درج کریں'})}</FormLabel>
                                        <FormControl><Input type="number" placeholder="PKR" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        </TabsContent>
                    )}
                    {enabledSourceIds.includes('agriculture') && (
                        <TabsContent value="agriculture">
                            <div className="p-4 border rounded-md">
                                <h3 className="text-lg font-medium mb-4">{t({en: 'Agriculture Income', ur: 'زرعی آمدنی'})}</h3>
                                <FormField control={form.control} name="agriculture.amount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t({en: 'Enter Total Agriculture Income During The Year', ur: 'سال کے دوران کل زرعی آمدنی درج کریں'})}</FormLabel>
                                        <FormControl><Input type="number" placeholder="PKR" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
             </Form>
             <div className="flex justify-between mt-6">
                <Button onClick={() => setView('selection')} variant="outline">{t({ en: 'Back to Selection', ur: 'انتخاب پر واپس' })}</Button>
                <Button onClick={onNext}>{t({ en: 'Save & Next', ur: 'محفوظ کریں اور آگے بڑھیں' })}</Button>
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-6">
                <CardTitle>{t({ en: "Income Sources", ur: "آمدنی کے ذرائع" })}</CardTitle>
                <CardDescription>{t({ en: "Please select all applicable sources of your income for the tax year.", ur: "ٹیکس سال کے لیے براہ کرم اپنی آمدنی کے تمام قابل اطلاق ذرائع منتخب کریں۔" })}</CardDescription>
            </div>
            {view === 'selection' ? renderSourceSelection() : renderForms()}
        </div>
    );
}

    