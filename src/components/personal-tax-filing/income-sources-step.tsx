'use client';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';

export function IncomeSourcesStep() {
    const { t } = useLanguage();
    return (
        <div>
            <div className="mb-6">
                <CardTitle>{t({ en: "Income Sources", ur: "آمدنی کے ذرائع" })}</CardTitle>
                <CardDescription>{t({ en: "Please provide details about your income from various sources.", ur: "براہ کرم مختلف ذرائع سے اپنی آمدنی کی تفصیلات فراہم کریں۔" })}</CardDescription>
            </div>
            <div className="text-center text-muted-foreground py-10">
                <p>{t({ en: 'Income sources form will be here. This feature is under construction.', ur: 'آمدنی کے ذرائع کا فارم یہاں ہوگا۔ یہ فیچر زیر تعمیر ہے۔' })}</p>
            </div>
        </div>
    );
}
