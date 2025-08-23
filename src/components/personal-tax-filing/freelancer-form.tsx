
'use client';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/context/language-context';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { BusinessIncomeForm } from './business-income-form';
import { Separator } from '../ui/separator';

export function FreelancerForm({ form: passedForm }: { form: any }) {
    const { t } = useLanguage();
    const { control, watch } = useFormContext();

    const incomeFromAbroad = watch('freelancer.incomeFromAbroad');
    const isPsebRegistered = watch('freelancer.isPsebRegistered');
    const showWithholdingForm = incomeFromAbroad === 'no' || (incomeFromAbroad === 'yes' && isPsebRegistered);

    return (
        <Form {...passedForm}>
            <div className="p-4 border rounded-md space-y-6">
                <h3 className="text-lg font-medium">{t({en: 'Freelancer Details', ur: 'فری لانسر کی تفصیلات'})}</h3>
                <FormField
                    control={control}
                    name="freelancer.incomeFromAbroad"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel className="font-semibold">{t({en: 'Did you earn any income from abroad by providing services?', ur: 'کیا آپ نے خدمات فراہم کرکے بیرون ملک سے کوئی آمدنی حاصل کی؟'})}</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="abroad_yes" /></FormControl><FormLabel htmlFor="abroad_yes" className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="abroad_no" /></FormControl><FormLabel htmlFor="abroad_no" className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                {incomeFromAbroad === 'yes' && (
                    <div className="pl-4 border-l-2 animate-in fade-in-50">
                         <FormField
                            control={control}
                            name="freelancer.isPsebRegistered"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel className="font-semibold">{t({en: 'Are you registered with PSEB?', ur: 'کیا آپ PSEB کے ساتھ رجسٹرڈ ہیں؟'})}</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="pseb_yes" /></FormControl><FormLabel htmlFor="pseb_yes" className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="pseb_no" /></FormControl><FormLabel htmlFor="pseb_no" className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel></FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}
                
                {showWithholdingForm && (
                     <div className="pt-6 animate-in fade-in-50">
                        <Separator className="mb-6" />
                        <BusinessIncomeForm form={passedForm} incomeType="freelancer" basePath="freelancer" />
                     </div>
                )}
            </div>
        </Form>
    );
}
