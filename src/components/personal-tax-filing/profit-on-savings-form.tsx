
'use client';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { PiggyBank, Landmark, ShieldCheck, UserCheck, CheckCircle, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const savingsSources = [
  { id: 'bankDeposit', label: { en: 'Profit on Bank Deposit', ur: 'بینک ڈپازٹ پر منافع' }, icon: PiggyBank },
  { id: 'govtScheme', label: { en: 'Govt Scheme', ur: 'سرکاری اسکیم' }, icon: Landmark },
  { id: 'behbood', label: { en: 'Behbood', ur: 'بہبود' }, icon: ShieldCheck },
  { id: 'pensionerBenefit', label: { en: 'Pensioner\'s Benefit', ur: 'پنشنر کا فائدہ' }, icon: UserCheck },
];

const BankDepositForm = () => {
    const { t } = useLanguage();
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "savingsProfit.bankDeposit",
    });

    return (
        <div className="space-y-4">
            {fields.map((item, index) => (
                <div key={item.id} className="grid md:grid-cols-5 gap-4 p-4 border rounded-md items-end">
                    <FormField control={control} name={`savingsProfit.bankDeposit.${index}.bankName`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Bank Name', ur: 'بینک کا نام'})}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={control} name={`savingsProfit.bankDeposit.${index}.accountNumber`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Account Number', ur: 'اکاؤنٹ نمبر'})}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={control} name={`savingsProfit.bankDeposit.${index}.amount`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Profit Amount', ur: 'منافع کی رقم'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={control} name={`savingsProfit.bankDeposit.${index}.taxDeducted`} render={({ field }) => (
                        <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            ))}
             <Button type="button" variant="outline" size="sm" onClick={() => append({})}><PlusCircle className="mr-2 h-4 w-4" />{t({en: "Add New Bank", ur: "نیا بینک شامل کریں"})}</Button>
        </div>
    );
};

const GovtSchemeForm = () => {
    const { t } = useLanguage();
    const { control } = useFormContext();
    const basePath = "savingsProfit.govtScheme";

    return (
        <div className="grid md:grid-cols-3 gap-4 p-4 border rounded-md">
            <FormField control={control} name={`${basePath}.schemeType`} render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Scheme Type', ur: 'اسکیم کی قسم'})}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent>
                    <SelectItem value="defence">{t({en: 'Defence Savings Certificate', ur: 'دفاعی بچت سرٹیفکیٹ'})}</SelectItem>
                    <SelectItem value="regular">{t({en: 'Regular Income Certificate', ur: 'باقاعدہ آمدنی سرٹیفکیٹ'})}</SelectItem>
                    <SelectItem value="special">{t({en: 'Special Saving Certificate', ur: 'خصوصی بچت سرٹیفکیٹ'})}</SelectItem>
                    <SelectItem value="short_term">{t({en: 'Short Term Saving Certificate', ur: 'قلیل مدتی بچت سرٹیفکیٹ'})}</SelectItem>
                    <SelectItem value="account">{t({en: 'Special Savings Account', ur: 'خصوصی بچت اکاؤنٹ'})}</SelectItem>
                </SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField control={control} name={`${basePath}.amount`} render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Profit Amount', ur: 'منافع کی رقم'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={control} name={`${basePath}.taxDeducted`} render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
    );
};

const BehboodForm = () => {
    const { t } = useLanguage();
    const { control } = useFormContext();
    return (
        <div className="p-4 border rounded-md">
            <FormField control={control} name="savingsProfit.behbood.amount" render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Enter Behbood Income', ur: 'بہبود آمدنی درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
    );
};

const PensionerBenefitForm = () => {
    const { t } = useLanguage();
    const { control } = useFormContext();
    return (
        <div className="p-4 border rounded-md">
            <FormField control={control} name="savingsProfit.pensionerBenefit.amount" render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Enter Pensioner Benefit Amount', ur: 'پنشنر فائدہ کی رقم درج کریں'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
    );
};

const formComponents: { [key: string]: React.ComponentType } = {
    bankDeposit: BankDepositForm,
    govtScheme: GovtSchemeForm,
    behbood: BehboodForm,
    pensionerBenefit: PensionerBenefitForm,
};

export function ProfitOnSavingsForm({ form: passedForm }: { form: any }) {
    const { t } = useLanguage();
    const { control, watch, setValue } = useFormContext();
    const [view, setView] = useState<'selection' | 'forms'>('selection');

    const selectedSources = watch('savingsProfit.selectedSources') || {};
    const enabledSources = Object.keys(selectedSources).filter(key => selectedSources[key]);

    const toggleSource = (sourceId: string) => {
        const currentSelection = watch(`savingsProfit.selectedSources.${sourceId}`);
        setValue(`savingsProfit.selectedSources.${sourceId}`, !currentSelection);
    };

    const handleContinue = () => {
        if (enabledSources.length > 0) {
            setView('forms');
        }
    };
    
    const renderSelection = () => (
         <div className="space-y-6">
            <h3 className="text-lg font-medium">{t({en: 'Select sources of profit on savings', ur: 'بچت پر منافع کے ذرائع منتخب کریں'})}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savingsSources.map((source) => {
                    const isSelected = selectedSources[source.id];
                    return (
                        <div
                            key={source.id}
                            onClick={() => toggleSource(source.id)}
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
            <div className="flex justify-end">
                <Button onClick={handleContinue} disabled={enabledSources.length === 0}>{t({en: 'Continue', ur: 'جاری رکھیں'})}</Button>
            </div>
        </div>
    );

    const renderForms = () => (
        <div className="space-y-6">
            <Tabs defaultValue={enabledSources[0]} className="w-full">
                 <TabsList>
                    {enabledSources.map(id => {
                        const sourceInfo = savingsSources.find(s => s.id === id);
                        return <TabsTrigger key={id} value={id}>{t(sourceInfo!.label)}</TabsTrigger>
                    })}
                </TabsList>
                {enabledSources.map(sourceId => {
                     const FormComponent = formComponents[sourceId];
                     return (
                        <TabsContent key={sourceId} value={sourceId}>
                            {FormComponent && <FormComponent />}
                        </TabsContent>
                    )
                })}
            </Tabs>
            <Button variant="link" onClick={() => setView('selection')}>{t({en: 'Back to selection', ur: 'انتخاب پر واپس'})}</Button>
        </div>
    );


    return (
        <Form {...passedForm}>
            <div className="p-4 border rounded-md space-y-6">
                 {view === 'selection' ? renderSelection() : renderForms()}
            </div>
        </Form>
    );
}
