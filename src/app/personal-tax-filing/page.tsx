
'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { PersonalInfoStep } from '@/components/personal-tax-filing/personal-info-step';
import { IncomeSourcesStep } from '@/components/personal-tax-filing/income-sources-step';
import { DeductionsStep } from '@/components/personal-tax-filing/deductions-step';
import { WealthStatementStep } from '@/components/personal-tax-filing/wealth-statement-step';
import { DocumentsStep } from '@/components/personal-tax-filing/documents-step';
import { ReviewSubmitStep } from '@/components/personal-tax-filing/review-submit-step';
import { PersonalTaxSidebar } from '@/components/personal-tax-filing/sidebar';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PersonalTaxFilingProvider, usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCart } from '@/context/cart-context';
import { useServices } from '@/hooks/useServices';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 'personal-info', name: { en: 'Personal Information', ur: 'ذاتی معلومات' } },
  { id: 'income-sources', name: { en: 'Income Sources', ur: 'آمدنی کے ذرائع' } },
  { id: 'deductions', name: { en: 'Deductions / Credits', ur: 'کٹوتی / کریڈٹ' } },
  { id: 'wealth-statement', name: { en: 'Wealth Statement', ur: 'دولت کا بیان' } },
  { id: 'documents', name: { en: 'Documents', ur: 'دستاویزات' } },
  { id: 'review', name: { en: 'Review & Submit', ur: 'جائزہ لیں اور جمع کرائیں' } },
];

function PersonalTaxFilingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const { formData } = usePersonalTaxFiling();
  const { services } = useServices();
  const { addItem } = useCart();
  const router = useRouter();


  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: "Not Authenticated", description: "You must be logged in to submit a filing." });
        return;
    }

    try {
        await addDoc(collection(db, "filings"), {
            userId: user.uid,
            userEmail: user.email,
            type: "Personal Tax",
            formData,
            status: 'submitted',
            createdAt: serverTimestamp(),
        });
        
        const taxFilingService = services.find(s => t(s.title).toLowerCase().includes('personal tax filing'));
        
        if (taxFilingService) {
            addItem({
                id: taxFilingService.id,
                name: taxFilingService.title,
                price: taxFilingService.price,
                serviceId: taxFilingService.id,
            });
             toast({
                title: "Added to Cart",
                description: "Personal Tax Filing service added to your cart.",
            });
            router.push('/cart');
        } else {
             toast({
                title: "Filing Submitted",
                description: "Your tax filing has been submitted for review.",
            });
            router.push('/dashboard');
        }

    } catch (error) {
        console.error("Error submitting filing:", error);
        toast({ variant: 'destructive', title: 'Submission Error', description: 'There was a problem submitting your filing.' });
    }
  }

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'personal-info':
        return <PersonalInfoStep />;
      case 'income-sources':
        return <IncomeSourcesStep />;
      case 'deductions':
        return <DeductionsStep />;
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
    <div className="flex flex-col md:flex-row gap-8">
      <PersonalTaxSidebar steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="flex-1">
        <Card>
          <CardContent className="p-6 min-h-[50vh]">
            {renderStep()}
          </CardContent>
        </Card>
        <div className="flex justify-between mt-6">
          <Button onClick={handleBack} disabled={currentStep === 0} variant="outline">
            {t({ en: 'Back', ur: 'پیچھے' })}
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              {t({ en: 'Next', ur: 'اگلا' })}
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              {t({ en: 'Submit & Add to Cart', ur: 'جمع کرائیں اور کارٹ میں شامل کریں' })}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


export default function PersonalTaxFilingPage() {
    const { t } = useLanguage();
    return (
        <AppLayout pageTitle={t({ en: "Personal Tax Filing", ur: "ذاتی ٹیکس فائلنگ" })}>
            <PersonalTaxFilingProvider>
                <PersonalTaxFilingWizard />
            </PersonalTaxFilingProvider>
        </AppLayout>
    )
}
