'use client';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface PersonalTaxSidebarProps {
    steps: { id: string; name: { en: string; ur: string } }[];
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

export function PersonalTaxSidebar({ steps, currentStep, setCurrentStep }: PersonalTaxSidebarProps) {
    const { t } = useLanguage();

    return (
        <aside className="w-full md:w-64">
            <nav className="space-y-1">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(index)}
                            className={cn(
                                "w-full text-left flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-accent/50",
                                isCompleted
                                    ? "text-muted-foreground hover:text-foreground"
                                    : ""
                            )}
                        >
                            {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <div className={cn(
                                    "h-5 w-5 rounded-full flex items-center justify-center border",
                                    isActive ? "border-primary" : "border-muted-foreground"
                                )}>
                                   <span className={cn(isActive ? "text-primary" : "text-muted-foreground", "text-xs")}>{index + 1}</span>
                                </div>
                            )}
                            <span className="truncate">{t(step.name)}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
