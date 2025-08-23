
'use client';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/context/language-context';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { BusinessIncomeForm } from './business-income-form';
import { Stethoscope, Scale, Building, Briefcase, DraftingCompass, Presentation, UserCheck, SquareActivity } from 'lucide-react';
import { cn } from '@/lib/utils';

const professionTypes = [
    { id: 'doctor', label: { en: 'Doctor', ur: 'ڈاکٹر' }, icon: Stethoscope },
    { id: 'lawyer', label: { en: 'Lawyer', ur: 'وکیل' }, icon: Scale },
    { id: 'accountant', label: { en: 'Accountant', ur: 'اکاؤنٹنٹ' }, icon: Briefcase },
    { id: 'engineer', label: { en: 'Engineer', ur: 'انجینئر' }, icon: DraftingCompass },
    { id: 'architect', label: { en: 'Architect', ur: 'ماہر تعمیرات' }, icon: Building },
    { id: 'tutor', label: { en: 'Tutor/Trainer/Coach', ur: 'ٹیوٹر/ٹرینر/کوچ' }, icon: Presentation },
    { id: 'consultant', label: { en: 'Management Consultant', ur: 'مینجمنٹ کنسلٹنٹ' }, icon: UserCheck },
    { id: 'other', label: { en: 'Other Profession', ur: 'دیگر پیشہ' }, icon: SquareActivity },
];


export function ProfessionalForm({ form: passedForm }: { form: any }) {
    const { t } = useLanguage();
    const { control, watch } = useFormContext();

    const selectedProfession = watch('professional.professionType');
    
    return (
        <Form {...passedForm}>
            <div className="p-4 border rounded-md space-y-6">
                <h3 className="text-lg font-medium">{t({en: 'Professional Details', ur: 'پیشہ ورانہ تفصیلات'})}</h3>

                <FormField
                    control={control}
                    name="professional.professionType"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel className="font-semibold">{t({en: 'Select your profession', ur: 'اپنا پیشہ منتخب کریں'})}</FormLabel>
                        <FormControl>
                            <RadioGroup 
                                onValueChange={field.onChange} 
                                defaultValue={field.value} 
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                                {professionTypes.map((prof) => (
                                    <FormItem key={prof.id}>
                                         <FormControl>
                                            <RadioGroupItem value={prof.id} id={prof.id} className="sr-only" />
                                        </FormControl>
                                        <FormLabel 
                                            htmlFor={prof.id}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all h-32",
                                                field.value === prof.id ? "border-primary bg-primary/10" : "border-transparent bg-muted/50 hover:bg-muted"
                                            )}
                                        >
                                            <prof.icon className={cn("h-10 w-10 mb-2", field.value === prof.id ? 'text-primary' : 'text-muted-foreground')} />
                                            <span className={cn("text-sm font-medium text-center", field.value === prof.id ? 'text-primary' : 'text-foreground')}>{t(prof.label)}</span>
                                        </FormLabel>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                {selectedProfession && (
                     <div className="pt-6 animate-in fade-in-50">
                        <BusinessIncomeForm form={passedForm} incomeType="professional" basePath="professional" />
                     </div>
                )}
            </div>
        </Form>
    );
}

