
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { Upload } from 'lucide-react';

const documentsSchema = z.object({
  salaryCertificate: z.any().optional(),
  taxChallan: z.any().optional(),
  otherDocuments: z.any().optional(),
});

type DocumentsFormData = z.infer<typeof documentsSchema>;

export function DocumentsStep() {
  const { t } = useLanguage();
  const form = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema),
  });

  return (
    <div>
      <div className="mb-6">
        <CardTitle>{t({ en: 'Upload Documents', ur: 'دستاویزات اپ لوڈ کریں' })}</CardTitle>
        <CardDescription>{t({ en: 'Upload any relevant documents for your tax filing. (e.g., salary slip, tax challans)', ur: 'اپنی ٹیکس فائلنگ کے لیے کوئی بھی متعلقہ دستاویزات اپ لوڈ کریں۔ (مثلاً، تنخواہ کی پرچی، ٹیکس چالان)' })}</CardDescription>
      </div>
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="salaryCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Salary Certificate / Slips', ur: 'تنخواہ کا سرٹیفکیٹ / پرچیاں' })}</FormLabel>
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
            <FormField
              control={form.control}
              name="taxChallan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t({ en: 'Tax Payment Challans', ur: 'ٹیکس ادائیگی کے چالان' })}</FormLabel>
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
             <FormField
              control={form.control}
              name="otherDocuments"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t({ en: 'Other Supporting Documents', ur: 'دیگر معاون دستاویزات' })}</FormLabel>
                   <FormControl>
                    <div className="flex items-center gap-2">
                        <Input type="file" {...field} multiple className="flex-1"/>
                        <Button variant="outline" size="icon"><Upload className="h-4 w-4"/></Button>
                    </div>
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
