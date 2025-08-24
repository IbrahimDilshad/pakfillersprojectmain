
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Upload } from 'lucide-react';

const fbrSchema = z.object({
  isNtnRegistered: z.enum(['yes', 'no']),
  fbrPassword: z.string().optional(),
  fbrPin: z.string().optional(),
  ntnImage: z.any().optional(),
});

type FbrFormData = z.infer<typeof fbrSchema>;

export function FbrCredentialsStep() {
  const { t } = useLanguage();
  const { formData, setFormData } = usePersonalTaxFiling();

  const form = useForm<FbrFormData>({
    resolver: zodResolver(fbrSchema),
    defaultValues: formData.fbr,
  });

  const isNtnRegistered = form.watch('isNtnRegistered');

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(prev => ({ ...prev, fbr: value as FbrFormData }));
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  return (
    <div>
      <div className="mb-6">
        <CardTitle>{t({ en: 'FBR Credentials', ur: 'ایف بی آر کی اسناد' })}</CardTitle>
        <CardDescription>{t({ en: 'Provide your FBR information for filing.', ur: 'فائلنگ کے لیے اپنی ایف بی آر کی معلومات فراہم کریں۔' })}</CardDescription>
      </div>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="isNtnRegistered"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t({ en: 'Are you already registered in NTN?', ur: 'کیا آپ پہلے ہی این ٹی این میں رجسٹرڈ ہیں؟' })}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="yes" id="ntn_yes" /></FormControl>
                      <FormLabel htmlFor="ntn_yes" className="font-normal">{t({ en: 'Yes', ur: 'ہاں' })}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="no" id="ntn_no" /></FormControl>
                      <FormLabel htmlFor="ntn_no" className="font-normal">{t({ en: 'No', ur: 'نہیں' })}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isNtnRegistered === 'yes' && (
            <div className="space-y-4 animate-in fade-in-50">
              <FormField
                control={form.control}
                name="fbrPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t({ en: 'FBR Password', ur: 'ایف بی آر پاس ورڈ' })}</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fbrPin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t({ en: 'FBR PIN', ur: 'ایف بی آر پن' })}</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {isNtnRegistered === 'no' && (
            <div className="space-y-4 animate-in fade-in-50">
               <FormField
                control={form.control}
                name="ntnImage"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t({ en: 'Upload relevant image', ur: 'متعلقہ تصویر اپ لوڈ کریں' })}</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-2">
                            <Input type="file" {...field} className="flex-1"/>
                            <Button variant="outline" size="icon"><Upload className="h-4 w-4"/></Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
