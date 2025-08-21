
'use client';
import { useServices } from "@/hooks/useServices";
import { useLanguage } from "@/context/language-context";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { DollarSign } from "lucide-react";

interface ServicePricingDisplayProps {
    serviceCode: string;
}

export function ServicePricingDisplay({ serviceCode }: ServicePricingDisplayProps) {
    const { t } = useLanguage();
    const { services, loading } = useServices();

    const service = services.find(s => s.serviceCode === serviceCode);

    if (loading) {
        return <Skeleton className="h-10 w-40" />;
    }

    if (!service) {
        return <Badge variant="destructive">{t({ en: "Pricing not available", ur: "قیمت دستیاب نہیں" })}</Badge>;
    }

    return (
        <div className="flex flex-col items-start">
             <p className="text-sm font-medium text-muted-foreground">{t({en: 'Service Cost', ur: 'سروس کی لاگت'})}</p>
            <Badge variant="secondary" className="text-lg font-bold py-2 px-4">
                <DollarSign className="h-5 w-5 mr-2" />
                PKR {service.price.toLocaleString()}
            </Badge>
        </div>
    );
}
