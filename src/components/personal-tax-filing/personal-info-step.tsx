'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { CardDescription, CardTitle } from '../ui/card';

const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, 'Invalid CNIC format (e.g., 12345-1234567-1)'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export function PersonalInfoStep() {
    const { t } = useLanguage();
    const form = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            fullName: '',
            email: '',
            cnic: '',
            phoneNumber: '',
        },
    });
    
  return (
    <div>
        <div className="mb-6">
            <CardTitle>{t({ en: "Personal Information", ur: "ذاتی معلومات" })}</CardTitle>
            <CardDescription>{t({ en: "Please fill in your personal details accurately.", ur: "براہ کرم اپنی ذاتی تفصیلات درست طریقے سے پر کریں۔" })}</CardDescription>
        </div>
        <Form {...form}>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Email Address', ur: 'ای میل اڈریس' })}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t({ en: 'e.g., user@example.com', ur: 'مثال کے طور پر، user@example.com' })} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'CNIC', ur: 'شناختی کارڈ نمبر' })}</FormLabel>
                  <FormControl>
                    <Input placeholder="12345-1234567-1" {...field} />
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
          </div>
        </form>
        </Form>
    </div>
  );
}
