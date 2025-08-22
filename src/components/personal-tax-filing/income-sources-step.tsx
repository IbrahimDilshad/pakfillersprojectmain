
'use client';
import { useMemo } from 'react';
import { CardDescription, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/language-context';
import { usePersonalTaxFiling } from '@/context/personal-tax-filing-context';
import { Briefcase, Building2, User, Laptop, GraduationCap, Landmark, Tractor, Percent, Cog, Users, Home, PiggyBank, AreaChart, TrendingUp, PlusCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const incomeSourcesList = [
  { id: 'hasSalary', label: { en: 'Salary', ur: 'تنخواہ' }, icon: Briefcase },
  { id: 'hasBusiness', label: { en: 'Business', ur: 'کاروبار' }, icon: Building2 },
  { id: 'hasSelfEmployed', label: { en: 'Self Employed', ur: 'خود ملازم' }, icon: User },
  { id: 'hasFreelancer', label: { en: 'Freelancer', ur: 'فری لانسر' }, icon: Laptop },
  { id: 'hasProfessional', label: { en: 'Professional', ur: 'پیشہ ور' }, icon: GraduationCap },
  { id: 'hasPension', label: { en: 'Pension', ur: 'پنشن' }, icon: Landmark },
  { id: 'hasAgriculture', label: { en: 'Agriculture', ur: 'زراعت' }, icon: Tractor },
  { id: 'hasCommission', label: { en: 'Commission', ur: 'کمیشن' }, icon: Percent },
  { id: 'hasServices', label: { en: 'Services', ur: 'خدمات' }, icon: Cog },
  { id: 'hasPartnership', label: { en: 'Partnership/AOP', ur: 'شراکت/اے او پی' }, icon: Users },
  { id: 'hasRent', label: { en: 'Rent/Property Sale', ur: 'کرایہ/جائیداد فروخت' }, icon: Home },
  { id: 'hasSavingsProfit', label: { en: 'Profit on Savings', ur: 'بچت پر منافع' }, icon: PiggyBank },
  { id: 'hasDividend', label: { en: 'Dividend', ur: 'منافع' }, icon: AreaChart },
  { id: 'hasGain', label: { en: 'Gain', ur: 'فائدہ' }, icon: TrendingUp },
  { id: 'hasOther', label: { en: 'Other Income', ur: 'دیگر آمدنی' }, icon: PlusCircle },
];


export function IncomeSourcesStep() {
    const { t } = useLanguage();
    const { formData, setFormData } = usePersonalTaxFiling();

    const toggleSource = (sourceId: keyof typeof formData.incomes) => {
        setFormData(prev => ({
            ...prev,
            incomes: {
                ...prev.incomes,
                [sourceId]: !prev.incomes[sourceId],
            },
        }));
    };
    
    return (
        <div>
            <div className="mb-6">
                <CardTitle>{t({ en: "Income Sources", ur: "آمدنی کے ذرائع" })}</CardTitle>
                <CardDescription>{t({ en: "Please select all applicable sources of your income for the tax year.", ur: "ٹیکس سال کے لیے براہ کرم اپنی آمدنی کے تمام قابل اطلاق ذرائع منتخب کریں۔" })}</CardDescription>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {incomeSourcesList.map((source) => {
                    const isSelected = formData.incomes[source.id as keyof typeof formData.incomes];
                    return (
                        <div
                            key={source.id}
                            onClick={() => toggleSource(source.id as keyof typeof formData.incomes)}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                                isSelected ? "border-primary bg-primary/10" : "border-transparent bg-muted/50 hover:bg-muted"
                            )}
                        >
                            <source.icon className={cn("h-10 w-10 mb-2", isSelected ? 'text-primary' : 'text-muted-foreground')} />
                            <span className={cn("text-sm font-medium text-center", isSelected ? 'text-primary' : 'text-foreground')}>{t(source.label)}</span>
                            {isSelected && (
                                <CheckCircle className="h-5 w-5 text-white bg-primary rounded-full absolute -top-2 -right-2" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
