
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import { useServices, Service } from '@/hooks/useServices';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { DollarSign } from 'lucide-react';

export default function AdminPricingPage() {
  const { t } = useLanguage();
  const { services, loading, setServices } = useServices();
  const { toast } = useToast();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [savingStatus, setSavingStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (services.length > 0) {
      const initialPrices = services.reduce((acc, service) => {
        acc[service.id] = service.price;
        return acc;
      }, {} as { [key: string]: number });
      setPrices(initialPrices);
    }
  }, [services]);

  const handlePriceChange = (serviceId: string, value: string) => {
    const newPrice = Number(value);
    if (!isNaN(newPrice)) {
      setPrices(prev => ({ ...prev, [serviceId]: newPrice }));
    }
  };

  const handleSavePrice = async (serviceId: string) => {
    if (prices[serviceId] === undefined) return;
    
    setSavingStatus(prev => ({ ...prev, [serviceId]: true }));
    try {
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, { price: prices[serviceId] });
      
      // Update local state to reflect change
      setServices(prevServices => prevServices.map(s => 
        s.id === serviceId ? { ...s, price: prices[serviceId] } : s
      ));

      toast({
        title: t({ en: "Price Updated", ur: "قیمت اپ ڈیٹ ہو گئی" }),
        description: `${t(services.find(s=>s.id === serviceId)?.title || {en: 'Service', ur: 'Service'})} ${t({en: 'price updated to', ur: 'کی قیمت اپ ڈیٹ ہو گئی'})} PKR ${prices[serviceId]}.`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t({ en: "Error", ur: "خرابی" }),
        description: t({ en: "Failed to update price.", ur: "قیمت اپ ڈیٹ کرنے میں ناکام۔" }),
      });
    } finally {
      setSavingStatus(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t({ en: "Manage Service Pricing", ur: "سروس کی قیمتوں کا نظم کریں" })}</CardTitle>
        <CardDescription>{t({ en: "Set the prices for all services and forms offered on the platform.", ur: "پلیٹ فارم پر پیش کی جانے والی تمام خدمات اور فارموں کی قیمتیں مقرر کریں۔" })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
          ) : (
            services.map(service => (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{t(service.title)}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <Label htmlFor={`price-${service.id}`}>{t({ en: "Price (PKR)", ur: "قیمت (PKR)" })}</Label>
                   <div className="flex items-center gap-2">
                     <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <Input
                      id={`price-${service.id}`}
                      type="number"
                      value={prices[service.id] || ''}
                      onChange={(e) => handlePriceChange(service.id, e.target.value)}
                    />
                   </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSavePrice(service.id)}
                    disabled={savingStatus[service.id]}
                  >
                    {savingStatus[service.id] ? t({ en: "Saving...", ur: "محفوظ ہو رہا ہے۔.." }) : t({ en: "Save Price", ur: "قیمت محفوظ کریں" })}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
