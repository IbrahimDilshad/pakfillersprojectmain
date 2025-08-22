'use client';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { PersonalInfoStep } from '@/components/personal-tax-filing/personal-info-step';
import { IncomeSourcesStep } from '@/components/personal-tax-filing/income-sources-step';
import { TaxCreditStep } from '@/components/personal-tax-filing/tax-credit-step';
import { WealthStatementStep } from '@/components/personal-tax-filing/wealth-statement-step';
import { DocumentsStep } from '@/components/personal-tax-filing/documents-step';
import { ReviewSubmitStep } from '@/components/personal-tax-filing/review-submit-step';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PersonalTaxFilingProvider, usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { useFormPrices } from '@/hooks/useFormPrices';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSignature, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'personal-info', name: { en: 'Personal Information', ur: 'ذاتی معلومات' } },
  { id: 'income-sources', name: { en: 'Income Sources', ur: 'آمدنی کے ذرائع' } },
  { id: 'tax-credit', name: { en: 'Tax Credit', ur: 'ٹیکس کریڈٹ' } },
  { id: 'wealth-statement', name: { en: 'Wealth Statement', ur: 'دولت کا بیان' } },
  { id: 'documents', name: { en: 'Documents', ur: 'دستاویزات' } },
  { id: 'review', name: { en: 'Review & Submit', ur: 'جائزہ لیں اور جمع کرائیں' } },
];

function PersonalTaxFilingWizard({ taxYear, onBack }: { taxYear: string, onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { activeUser } = useAuth();
  const { formData, setFormData } = usePersonalTaxFiling();
  const { formPrices } = useFormPrices();
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Set the selected tax year in the form data
    setFormData(prev => ({ ...prev, taxYear }));
  }, [taxYear, setFormData]);


  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
        onBack(); // Go back to year selection
    }
  };
  
  const handleSubmit = async () => {
    if (!activeUser) {
        toast({ variant: 'destructive', title: "Not Authenticated", description: "You must be logged in to submit a filing." });
        return;
    }

    const serviceCode = 'personal_tax_filing';
    let formPriceInfo = formPrices.find(p => p.id === serviceCode);

    // If price is not in DB, create it with a default price
    if (!formPriceInfo) {
        const defaultPrice = 3000;
        const name = { en: "Personal Tax Filing", ur: "ذاتی ٹیکس فائلنگ" };
        try {
            await setDoc(doc(db, "formPrices", serviceCode), { name, price: defaultPrice });
            formPriceInfo = { id: serviceCode, name, price: defaultPrice };
        } catch(e) {
            console.error("Failed to create default price", e);
            toast({ variant: 'destructive', title: "Error", description: "Could not set default price for service."});
            return;
        }
    }
    
    addItem({
        serviceId: formPriceInfo.id,
        name: formPriceInfo.name,
        price: formPriceInfo.price,
        filingData: formData, // Attach the form data to the cart item
    });
    toast({
        title: "Added to Cart",
        description: "Personal Tax Filing service added to your cart. Please complete the checkout process.",
    });
    router.push('/cart');
  }

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'personal-info':
        return <PersonalInfoStep />;
      case 'income-sources':
        return <IncomeSourcesStep />;
      case 'tax-credit':
        return <TaxCreditStep />;
      case 'wealth-statement':
        return <WealthStatementStep />;
      case 'documents':
        return <DocumentsStep />;
      case 'review':
        return <ReviewSubmitStep />;
      default:
        return (
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">{t(steps[currentStep].name)}</p>
            <p className="text-muted-foreground">{t({ en: 'This step is under construction.', ur: 'یہ قدم زیر تعمیر ہے۔' })}</p>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{t({en: 'Tax Filing for Year', ur: 'سال کے لیے ٹیکس فائلنگ'})} {taxYear}</span>
            <Button variant="link" onClick={onBack}>{t({en: 'Change Year', ur: 'سال تبدیل کریں'})}</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={steps[currentStep].id} onValueChange={(value) => setCurrentStep(steps.findIndex(s => s.id === value))} className="w-full">
            <TabsList className="grid w-full grid-cols-6 h-auto">
              {steps.map((step, index) => {
                 const isCompleted = index < currentStep;
                 const isActive = index === currentStep;
                return (
                  <TabsTrigger key={step.id} value={step.id} className="relative flex flex-col items-center h-full p-2 gap-1">
                     <span className={cn("text-xs md:text-sm text-center", isActive ? "font-bold" : "font-normal")}>{t(step.name)}</span>
                     {isCompleted && <CheckCircle className="h-4 w-4 text-green-500 absolute top-1 right-1" />}
                  </TabsTrigger>
                )
              })}
            </TabsList>
            <div className="p-6 min-h-[50vh] border-x border-b rounded-b-md">
                {renderStep()}
            </div>
          </Tabs>
        </CardContent>
      </Card>
        <div className="flex justify-between mt-6">
            <Button onClick={handleBack} variant="outline">
            {t({ en: 'Back', ur: 'پیچھے' })}
            </Button>
            {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
                {t({ en: 'Next', ur: 'اگلا' })}
            </Button>
            ) : (
            <Button onClick={handleSubmit}>
                {t({ en: 'Add to Cart & Proceed', ur: 'کارٹ میں شامل کریں اور آگے بڑھیں' })}
            </Button>
            )}
        </div>
    </div>
  );
}

function YearSelectionStep({ onProceed }: { onProceed: (year: string) => void }) {
    const { t } = useLanguage();
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    const years = Array.from({ length: 10 }, (_, i) => 2025 - i); // 2025 down to 2016

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
             <div className="bg-primary/10 text-primary p-4 rounded-full w-fit mb-6">
                <FileSignature className="h-12 w-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t({ en: "Tax Return Filing", ur: "ٹیکس ریٹرن فائلنگ" })}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t({ en: "Select the tax year you want to proceed with", ur: "وہ ٹیکس سال منتخب کریں جس کے ساتھ آپ آگے بڑھنا چاہتے ہیں" })}</p>
            <div className="mt-8 w-full max-w-xs space-y-4">
                 <Select onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-12 text-lg">
                        <SelectValue placeholder={t({ en: "Select a year", ur: "ایک سال منتخب کریں" })} />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(year => (
                             <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button size="lg" className="w-full" onClick={() => selectedYear && onProceed(selectedYear)} disabled={!selectedYear}>
                    {t({ en: "Proceed", ur: "آگے بڑھیں" })}
                </Button>
            </div>
        </div>
    )
}

function PersonalTaxFilingFlow() {
    const [taxYear, setTaxYear] = useState<string | null>(null);
    return taxYear ? 
        <PersonalTaxFilingWizard taxYear={taxYear} onBack={() => setTaxYear(null)} /> : 
        <YearSelectionStep onProceed={setTaxYear} />;
}


export default function PersonalTaxFilingPage() {
    const { t } = useLanguage();
    return (
        <AppLayout pageTitle={t({ en: "Personal Tax Filing", ur: "ذاتی ٹیکس فائلنگ" })}>
            <PersonalTaxFilingProvider>
                <PersonalTaxFilingFlow />
            </PersonalTaxFilingProvider>
        </AppLayout>
    )
}