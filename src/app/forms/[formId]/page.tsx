'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Printer, HelpCircle } from 'lucide-react';
import { AIAssistant } from '@/components/ai-assistant';
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  taxYear: z.string().min(1, 'Tax year is required'),
  employmentIncome: z.string().min(1, 'Employment income is required'),
  otherIncome: z.string().optional(),
  taxDeducted: z.string().min(1, 'Tax deducted is required'),
  city: z.string().min(1, 'City is required'),
});

type FormData = z.infer<typeof formSchema>;

interface AssistantState {
  open: boolean;
  fieldName: string;
  fieldLabel: string;
}

const formDetails = {
    'income-tax-return': { name: "Income Tax Return" },
    'sales-tax-return': { name: "Sales Tax Return" },
    'wealth-statement': { name: "Wealth Statement" },
    'withholding-tax-statement': { name: "Withholding Tax Statement" },
}

export default function InteractiveFormPage({ params }: { params: { formId: string } }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taxYear: '2024',
      employmentIncome: '',
      otherIncome: '',
      taxDeducted: '',
      city: '',
    },
  });

  const { toast } = useToast()

  const [assistantState, setAssistantState] = useState<AssistantState>({
    open: false,
    fieldName: '',
    fieldLabel: '',
  });

  const openAssistant = (fieldName: string, fieldLabel: string) => {
    setAssistantState({ open: true, fieldName, fieldLabel });
  };
  
  const currentFormDetails = formDetails[params.formId as keyof typeof formDetails] || { name: "Tax Form" };

  function onSubmit(data: FormData) {
    console.log(data);
    toast({
        title: "Form Submitted!",
        description: "Your tax form has been successfully submitted for review.",
    })
  }
  
  function onExport() {
    toast({
        title: "Exporting to PDF...",
        description: "This feature is coming soon.",
    })
  }

  return (
    <AppLayout pageTitle={currentFormDetails.name}>
      <AIAssistant
        open={assistantState.open}
        onOpenChange={(open) => setAssistantState((prev) => ({ ...prev, open }))}
        formName={currentFormDetails.name}
        fieldName={assistantState.fieldName}
        fieldLabel={assistantState.fieldLabel}
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fill in the details</CardTitle>
              <CardDescription>Please provide accurate information as per your records.</CardDescription>
            </div>
            <Button variant="outline" onClick={onExport}>
              <Printer className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="taxYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Tax Year
                        <HelpCircle
                          className="ml-2 h-4 w-4 text-muted-foreground cursor-pointer"
                          onClick={() => openAssistant('taxYear', 'Tax Year')}
                        />
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tax year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        City
                        <HelpCircle
                          className="ml-2 h-4 w-4 text-muted-foreground cursor-pointer"
                          onClick={() => openAssistant('city', 'City')}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Karachi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Income from Employment (PKR)
                        <HelpCircle
                          className="ml-2 h-4 w-4 text-muted-foreground cursor-pointer"
                          onClick={() => openAssistant('employmentIncome', 'Income from Employment')}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1200000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Other Income (Optional, PKR)
                        <HelpCircle
                          className="ml-2 h-4 w-4 text-muted-foreground cursor-pointer"
                          onClick={() => openAssistant('otherIncome', 'Other Income')}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="taxDeducted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Total Tax Deducted at Source (PKR)
                        <HelpCircle
                          className="ml-2 h-4 w-4 text-muted-foreground cursor-pointer"
                          onClick={() => openAssistant('taxDeducted', 'Total Tax Deducted')}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Submit Form</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
