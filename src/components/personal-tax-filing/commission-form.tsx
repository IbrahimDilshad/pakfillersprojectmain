
'use client';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { Separator } from '../ui/separator';

const commissionTypes = [
    { id: 'lifeInsuranceAgent', label: { en: 'Life Insurance Agent (taxed at 8% up to 5 lac and 12% above 5 lac)', ur: 'لائف انشورنس ایجنٹ (5 لاکھ تک 8% اور 5 لاکھ سے اوپر 12% ٹیکس)' } },
    { id: 'generalInsuranceAgent', label: { en: 'Insurance Agent-General/Others (taxed at 12%)', ur: 'انشورنس ایجنٹ-جنرل/دیگر (12% ٹیکس)' } },
    { id: 'realEstateAgent', label: { en: 'Real Estate/Travel Agent (taxed at 12%)', ur: 'ریل اسٹیٹ/ٹریول ایجنٹ (12% ٹیکس)' } },
    { id: 'servicesConsultancy', label: { en: 'Services/Consultancy (taxed at 10%)', ur: 'خدمات/کنسلٹنسی (10% ٹیکس)' } },
    { id: 'otherCommissions', label: { en: 'Other Commissions (taxed at 12%)', ur: 'دیگر کمیشن (12% ٹیکس)' } },
];

export function CommissionForm({ form: passedForm }: { form: any }) {
    const { t } = useLanguage();
    const { control } = useFormContext();

    return (
        <Form {...passedForm}>
            <div className="p-4 border rounded-md space-y-6">
                <h3 className="text-lg font-medium">{t({en: 'Commission Details', ur: 'کمیشن کی تفصیلات'})}</h3>
                <div className="space-y-6">
                    {commissionTypes.map((commission, index) => (
                        <div key={commission.id}>
                            <h4 className="font-semibold mb-2">{t(commission.label)}</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                 <FormField
                                    control={control}
                                    name={`commission.${commission.id}.amount`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t({en: 'Amount', ur: 'رقم'})}</FormLabel>
                                            <FormControl><Input type="number" {...field} placeholder="PKR" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`commission.${commission.id}.taxDeducted`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t({en: 'Tax Deducted', ur: 'ٹیکس کٹوتی'})}</FormLabel>
                                            <FormControl><Input type="number" {...field} placeholder="PKR" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`commission.${commission.id}.expense`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t({en: 'Expense', ur: 'اخراجات'})}</FormLabel>
                                            <FormControl><Input type="number" {...field} placeholder="PKR" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {index < commissionTypes.length - 1 && <Separator className="mt-6" />}
                        </div>
                    ))}
                </div>
            </div>
        </Form>
    )
}
