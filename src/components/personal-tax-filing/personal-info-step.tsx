
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { CardDescription, CardTitle } from '../ui/card';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';

const personalInfoSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  dateOfBirth: z.date().optional(),
  passport: z.string().optional(),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  nationality: z.enum(['pakistani', 'foreigner'], { required_error: "Nationality is required" }),
  residencyStatus: z.enum(['resident', 'non-resident'], { required_error: "Residency status is required" }),
  foreignerEmploymentStay: z.enum(['yes', 'no']).optional(),
  foreignerThreeYearStay: z.enum(['yes', 'no']).optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export function PersonalInfoStep() {
    const { t } = useLanguage();
    const { formData, setFormData } = usePersonalTaxFiling();
    
    const form = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: formData.personalInfo,
    });
    
    const nationality = form.watch('nationality');

    useEffect(() => {
        const subscription = form.watch((value) => {
            setFormData(prev => ({...prev, personalInfo: value as PersonalInfoFormData}));
        });
        return () => subscription.unsubscribe();
    }, [form, setFormData]);
    
  return (
    <div>
        <div className="mb-6">
            <CardTitle>{t({ en: "Personal Information", ur: "ذاتی معلومات" })}</CardTitle>
            <CardDescription>{t({ en: "Please fill in your personal details accurately.", ur: "براہ کرم اپنی ذاتی تفصیلات درست طریقے سے پر کریں۔" })}</CardDescription>
        </div>
        <Form {...form}>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Full Name', ur: 'پورا نام' })}</FormLabel>
                  <FormControl>
                    <Input placeholder={t({ en: 'e.g., John Doe', ur: 'مثال کے طور پر، جان ڈو' })} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t({en: 'Date of Birth', ur: 'پیدائش کی تاریخ'})}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t({en: 'Pick a date', ur: 'ایک تاریخ منتخب کریں'})}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="passport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Passport Number', ur: 'پاسپورٹ نمبر' })}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({en: 'Occupation', ur: 'پیشہ'})}</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t({ en: "Select your occupation", ur: "اپنا پیشہ منتخب کریں"})} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="corporate">{t({en: 'Corporate Sector', ur: 'کارپوریٹ سیکٹر'})}</SelectItem>
                      <SelectItem value="federal-gov">{t({en: 'Federal Government', ur: 'وفاقی حکومت'})}</SelectItem>
                      <SelectItem value="provincial-gov">{t({en: 'Provincial Government', ur: 'صوبائی حکومت'})}</SelectItem>
                      <SelectItem value="researcher-teacher">{t({en: 'Researcher/Teacher', ur: 'محقق/استاد'})}</SelectItem>
                      <SelectItem value="other">{t({en: 'Others', ur: 'دیگر'})}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Email Address', ur: 'ای میل اڈریس' })}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Phone Number', ur: 'فون نمبر' })}</FormLabel>
                  <FormControl>
                    <Input placeholder="+92 300 1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>{t({en: 'Nationality', ur: 'قومیت'})}</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        >
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                            <RadioGroupItem value="pakistani" id="pakistani" />
                            </FormControl>
                            <FormLabel htmlFor="pakistani" className="font-normal">{t({en: 'Pakistani', ur: 'پاکستانی'})}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                            <RadioGroupItem value="foreigner" id="foreigner" />
                            </FormControl>
                            <FormLabel htmlFor="foreigner" className="font-normal">{t({en: 'Foreigner', ur: 'غیر ملکی'})}</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="residencyStatus"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>{t({en: 'Residency Status', ur: 'رہائشی حیثیت'})}</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        >
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                            <RadioGroupItem value="resident" id="resident" />
                            </FormControl>
                            <FormLabel htmlFor="resident" className="font-normal">{t({en: 'Resident', ur: 'رہائشی'})}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                            <RadioGroupItem value="non-resident" id="non-resident" />
                            </FormControl>
                            <FormLabel htmlFor="non-resident" className="font-normal">{t({en: 'Non-Resident', ur: 'غیر رہائشی'})}</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {nationality === 'foreigner' && (
                <div className="md:col-span-2 space-y-6 animate-in fade-in-50">
                    <Separator />
                    <FormField
                        control={form.control}
                        name="foreignerEmploymentStay"
                        render={({ field }) => (
                             <FormItem className="space-y-3">
                                <FormLabel>{t({en: 'Is your stay in Pakistan solely because of your employment?', ur: 'کیا آپ کا پاکستان میں قیام صرف آپ کی ملازمت کی وجہ سے ہے؟'})}</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-4"
                                    >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl><RadioGroupItem value="yes" id="emp_yes" /></FormControl>
                                        <FormLabel htmlFor="emp_yes" className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl><RadioGroupItem value="no" id="emp_no" /></FormControl>
                                        <FormLabel htmlFor="emp_no" className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="foreignerThreeYearStay"
                        render={({ field }) => (
                             <FormItem className="space-y-3">
                                <FormLabel>{t({en: 'Was your stay in Pakistan as of June 30, 2025 more than 3 years?', ur: 'کیا 30 جون 2025 تک آپ کا پاکستان میں قیام 3 سال سے زیادہ تھا؟'})}</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-4"
                                    >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl><RadioGroupItem value="yes" id="stay_yes" /></FormControl>
                                        <FormLabel htmlFor="stay_yes" className="font-normal">{t({en: 'Yes', ur: 'ہاں'})}</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl><RadioGroupItem value="no" id="stay_no" /></FormControl>
                                        <FormLabel htmlFor="stay_no" className="font-normal">{t({en: 'No', ur: 'نہیں'})}</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
          </div>
        </form>
        </Form>
    </div>
  );
}
