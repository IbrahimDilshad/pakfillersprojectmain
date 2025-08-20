
'use client';
import { useServices } from "@/hooks/useServices";
import { useLanguage } from "@/context/language-context";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { DollarSign } from "lucide-react";

interface ServicePricingDisplayProps {
    serviceTitle: string;
}

export function ServicePricingDisplay({ serviceTitle }: ServicePricingDisplayProps) {
    const { t } = useLanguage();
    const { services, loading } = useServices();

    const service = services.find(s => t(s.title).toLowerCase().includes(serviceTitle.toLowerCase()));

    if (loading) {
        return <Skeleton className="h-8 w-32" />;
    }

    if (!service) {
        return <Badge variant="destructive">{t({ en: "Not Available", ur: "دستیاب نہیں" })}</Badge>;
    }

    return (
        <Badge variant="secondary" className="text-lg font-bold py-2 px-4">
            <DollarSign className="h-5 w-5 mr-2" />
            {t({ en: "Cost:", ur: "لاگت:" })} PKR {service.price.toLocaleString()}
        </Badge>
    );
}
