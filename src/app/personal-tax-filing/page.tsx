
'use client';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { PersonalInfoStep } from '@/components/personal-tax-filing/personal-info-step';
import { IncomeSourcesStep } from '@/components/personal-tax-filing/income-sources-step';
import { TaxCreditStep } from '@/components/personal-tax-filing/tax-credit-step';
import { DeductionsStep } from '@/components/personal-tax-filing/deductions-step';
import { WealthStatementStep } from '@/components/personal-tax-filing/wealth-statement-step';
import { ExpenseStep } from '@/components/personal-tax-filing/expense-step';
import { WrapUpStep } from '@/components/personal-tax-filing/wrap-up-step';
import { FbrCredentialsStep } from '@/components/personal-tax-filing/fbr-credentials-step';
import { ReviewSubmitStep } from '@/components/personal-tax-filing/review-submit-step';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { FileSignature, CheckCircle, PlusCircle, ArrowRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CalculationSidebar } from '@/components/personal-tax-filing/calculation-sidebar';

const steps = [
  { id: 'personal-info', name: { en: 'Personal Information', ur: 'ذاتی معلومات' } },
  { id: 'income-sources', name: { en: 'Income Sources', ur: 'آمدنی کے ذرائع' } },
  { id: 'tax-credit', name: { en: 'Tax Credit', ur: 'ٹیکس کریڈٹ' } },
  { id: 'deductions', name: { en: 'Tax Deducted', ur: 'منہا ٹیکس' } },
  { id: 'wealth-statement', name: { en: 'Wealth Statement', ur: 'گوشوارہ' } },
  { id: 'expense', name: { en: 'Expense', ur: 'اخراجات' } },
  { id: 'wrap-up', name: { en: 'Wrap Up', ur: 'نتیجہ' } },
  { id: 'fbr-credentials', name: { en: 'FBR Credentials', ur: 'ایف بی آر کی اسناد' } },
  { id: 'review', name: { en: 'Review & Submit', ur: 'جائزہ لیں اور جمع کرائیں' } },
];

function PersonalTaxFilingWizard({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { activeUser } = useAuth();
  const { formData, setFormData } = usePersonalTaxFiling();
  const { formPrices } = useFormPrices();
  const { addItem } = useCart();
  const router = useRouter();

  const taxYear = formData.taxYear;
  if (!taxYear) {
      // This should ideally not happen if the flow is correct.
      return <p>Tax year not selected.</p>;
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
        onBackToDashboard();
    }
  };
  
  const handleSubmit = async () => {
    if (!activeUser) {
        toast({ variant: 'destructive', title: "Not Authenticated", description: "You must be logged in to submit a filing." });
        return;
    }

    const serviceCode = 'personal_tax_filing';
    let formPriceInfo = formPrices.find(p => p.id === serviceCode);

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
        filingData: formData,
    });
    toast({
        title: "Added to Cart",
        description: "Personal Tax Filing service added to your cart. Please complete the checkout process.",
    });
    router.push('/cart');
  }

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'personal-info': return <PersonalInfoStep />;
      case 'income-sources': return <IncomeSourcesStep onNext={handleNext} onBack={handleBack} />;
      case 'tax-credit': return <TaxCreditStep />;
      case 'deductions': return <DeductionsStep />;
      case 'wealth-statement': return <WealthStatementStep />;
      case 'expense': return <ExpenseStep />;
      case 'wrap-up': return <WrapUpStep setCurrentStep={setCurrentStep} />;
      case 'fbr-credentials': return <FbrCredentialsStep />;
      case 'review': return <ReviewSubmitStep />;
      default:
        return (
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">{t(steps[currentStep].name)}</p>
            <p className="text-muted-foreground">{t({ en: 'This step is under construction.', ur: 'یہ قدم زیر تعمیر ہے۔' })}</p>
          </div>
        );
    }
  };
  
  const showMainNavigation = steps[currentStep].id !== 'income-sources';

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>{t({en: 'Tax Filing for Year', ur: 'سال کے لیے ٹیکس فائلنگ'})} {taxYear}</span>
                <Button variant="link" onClick={onBackToDashboard}>{t({en: 'Back to Dashboard', ur: 'ڈیش بورڈ پر واپس'})}</Button>
            </CardTitle>
            </CardHeader>
            <CardContent>
            <Tabs value={steps[currentStep].id} onValueChange={(value) => setCurrentStep(steps.findIndex(s => s.id === value))} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 h-auto">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    return (
                    <TabsTrigger key={step.id} value={step.id} className="relative flex flex-col items-center h-full p-2 gap-1 text-xs">
                        <span className={cn("text-center", isActive ? "font-bold" : "font-normal")}>{t(step.name)}</span>
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
        {showMainNavigation && (
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
        )}
        </div>

        <div className="sticky top-20">
            <CalculationSidebar />
        </div>
    </div>
  );
}

function FilingDashboard({ onNew, onResume }: { onNew: () => void, onResume: () => void }) {
    const { t } = useLanguage();
    const { formData } = usePersonalTaxFiling();
    
    // Check if there's any data that indicates an in-progress filing
    const hasInProgressFiling = !!formData.taxYear;

    return (
         <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{t({ en: "Your Tax Filings", ur: "آپ کی ٹیکس فائلنگز" })}</CardTitle>
                <CardDescription>{t({ en: "Manage your existing tax filings or start a new one.", ur: "اپنی موجودہ ٹیکس فائلنگز کا نظم کریں یا نئی شروع کریں۔" })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {hasInProgressFiling ? (
                    <Card className="bg-muted/30">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">{t({en: 'In-Progress Filing for', ur: 'کے لیے جاری فائلنگ'})} {formData.taxYear}</CardTitle>
                                <CardDescription>{t({en: 'Last updated: now', ur: 'آخری اپ ڈیٹ: ابھی'})}</CardDescription>
                            </div>
                            <Button onClick={onResume}>
                                {t({ en: 'Resume Filing', ur: 'فائلنگ دوبارہ شروع کریں' })}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardHeader>
                    </Card>
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                        {t({en: 'You have no in-progress filings.', ur: 'آپ کی کوئی جاری فائلنگ نہیں ہے۔'})}
                    </div>
                )}

                 <div className="flex items-center gap-4">
                    <div className="flex-grow border-t"></div>
                    <span className="text-muted-foreground text-sm">{t({en: 'OR', ur: 'یا'})}</span>
                    <div className="flex-grow border-t"></div>
                </div>
                
                 <Button variant="outline" className="w-full h-16" onClick={onNew}>
                    <PlusCircle className="mr-4 h-6 w-6" />
                    <span className="text-lg">{t({ en: "Start a New Tax Filing", ur: "نئی ٹیکس فائلنگ شروع کریں" })}</span>
                </Button>
            </CardContent>
         </Card>
    );
}


function YearSelectionStep({ onProceed }: { onProceed: (year: string) => void }) {
    const { t } = useLanguage();
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

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
    type View = 'dashboard' | 'year-selection' | 'wizard';
    const [view, setView] = useState<View>('dashboard');
    const { formData, setFormData } = usePersonalTaxFiling();

    const handleNew = () => {
        setFormData({}); // Clear old data
        setView('year-selection');
    }
    
    const handleResume = () => {
        setView('wizard');
    }
    
    const handleYearSelected = (year: string) => {
        setFormData(prev => ({...prev, taxYear: year}));
        setView('wizard');
    }

    const handleBackToDashboard = () => {
        setView('dashboard');
    }

    switch (view) {
        case 'dashboard':
            return <FilingDashboard onNew={handleNew} onResume={handleResume} />;
        case 'year-selection':
            return <YearSelectionStep onProceed={handleYearSelected} />;
        case 'wizard':
            return <PersonalTaxFilingWizard onBackToDashboard={handleBackToDashboard} />;
        default:
             return <FilingDashboard onNew={handleNew} onResume={handleResume} />;
    }
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
