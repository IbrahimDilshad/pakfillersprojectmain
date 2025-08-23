
'use client';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { PiggyBank, Landmark, ShieldCheck, UserCheck, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '../ui/button';

const savingsSources = [
  { id: 'bankDeposit', label: { en: 'Profit on Bank Deposit', ur: 'بینک ڈپازٹ پر منافع' }, icon: PiggyBank },
  { id: 'govtScheme', label: { en: 'Govt Scheme', ur: 'سرکاری اسکیم' }, icon: Landmark },
  { id: 'behbood', label: { en: 'Behbood', ur: 'بہبود' }, icon: ShieldCheck },
  { id: 'pensionerBenefit', label: { en: 'Pensioner\'s Benefit', ur: 'پنشنر کا فائدہ' }, icon: UserCheck },
];

const SavingsSourceForm = ({ source }: { source: string }) => {
    const { t } = useLanguage();
    const { control } = useFormContext();
    const basePath = `savingsProfit.${source}`;
    
    return (
        <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-md">
            <FormField control={control} name={`${basePath}.amount`} render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Amount', ur: 'رقم'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={control} name={`${basePath}.taxDeducted`} render={({ field }) => (
                <FormItem><FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
    );
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
                {enabledSources.map(sourceId => (
                    <TabsContent key={sourceId} value={sourceId}>
                        <SavingsSourceForm source={sourceId} />
                    </TabsContent>
                ))}
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
