
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
import { PersonalTaxFilingProvider } from '@/context/personal-tax-filing-context';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleSubmit = () => {
    toast({
        title: "Form Submitted!",
        description: "Your tax form has been successfully submitted for review.",
    });
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
          <CardContent className="p-6">
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
              {t({ en: 'Submit for Review', ur: 'جائزہ کے لیے جمع کرائیں' })}
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
