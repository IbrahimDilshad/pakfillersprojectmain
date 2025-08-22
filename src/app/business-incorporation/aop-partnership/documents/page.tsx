
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { Download, File as FileIcon, Trash2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { useFormPrices } from '@/hooks/useFormPrices';
import { ServicePricingDisplay } from '@/components/service-pricing-display';

interface UploadedFile {
  id: string;
  name: string;
  file: File;
  type: string;
}

const requiredDocs = [
  { id: 'deed', title: { en: 'Partnership Deed', ur: 'شراکت نامہ' } },
  { id: 'certificate', title: { en: 'Partnership Registration Certificate', ur: 'شراکت داری رجسٹریشن سرٹیفکیٹ' } },
  { id: 'authority', title: { en: 'Authority Letter', ur: 'اتھارٹی لیٹر' } },
  { id: 'cnic', title: { en: "Partners' CNIC Copies", ur: 'شراکت داروں کے شناختی کارڈ کی کاپیاں' } },
  { id: 'ownership', title: { en: 'Rent/Ownership Documents', ur: 'کرایہ/ملکیت کے دستاویزات' } },
  { id: 'bill', title: { en: 'Latest Paid Electricity Bill', ur: 'بجلی کا تازہ ترین ادا شدہ بل'}},
  { id: 'letterhead', title: { en: 'Firm Letterhead', ur: 'فرم کا لیٹر ہیڈ' } },
];

export default function AopPartnershipDocumentsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { addItem } = useCart();
  const { formPrices } = useFormPrices();
  const serviceCode = 'aop_partnership';
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile: UploadedFile = {
        id: `${type}-${Date.now()}`,
        name: file.name,
        file,
        type,
      };

      setUploadedFiles(prev => {
        const otherFiles = prev.filter(f => f.type !== type);
        return [...otherFiles, newFile];
      });
    }
  };

  const handleFileDelete = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };
  
  const handleFileDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    const service = formPrices.find(s => s.id === serviceCode);
     if (service) {
        addItem({
            serviceId: service.id,
            name: service.name,
            price: service.price,
        });
        toast({
            title: t({ en: "Service Added", ur: "سروس شامل کر دی گئی" }),
            description: t({ en: "AOP/Partnership Registration has been added to your cart.", ur: "اے او پی/شراکت داری رجسٹریشن آپ کی کارٹ میں شامل کر دی گئی ہے۔" })
        });
        router.push('/cart');
    } else {
         toast({
            variant: 'destructive',
            title: t({ en: "Service Not Found", ur: "سروس نہیں ملی" }),
            description: t({ en: "This service is currently unavailable.", ur: "یہ سروس فی الحال دستیاب نہیں ہے۔" })
        });
    }
  };

  return (
    <AppLayout pageTitle={t({ en: 'Upload Documents', ur: 'دستاویزات اپ لوڈ کریں' })}>
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'Upload Required Documents for AOP/Partnership', ur: 'اے او پی/شراکت داری کے لیے مطلوبہ دستاویزات اپ لوڈ کریں' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please upload the following documents to proceed.',
                ur: 'آگے بڑھنے کے لیے براہ کرم درج ذیل دستاویزات اپ لوڈ کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {requiredDocs.map(doc => {
                const isUploaded = uploadedFiles.some(f => f.type === doc.id);
                return (
                  <div key={doc.id}>
                    <label htmlFor={`file-upload-${doc.id}`} className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploaded ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent'}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-2">
                        <UploadCloud className={`w-8 h-8 mb-2 ${isUploaded ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`text-sm ${isUploaded ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{t(doc.title)}</p>
                      </div>
                      <input id={`file-upload-${doc.id}`} type="file" className="hidden" onChange={(e) => handleFileChange(e, doc.id)} />
                    </label>
                  </div>
                )
              })}
            </div>

            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">{t({ en: 'Uploaded Files', ur: 'اپ لوڈ کردہ فائلیں' })}</h3>
                <div className="space-y-2">
                    {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <FileIcon className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium truncate">{file.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleFileDownload(file.file)}>
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleFileDelete(file.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-between items-center mt-6">
            <ServicePricingDisplay serviceCode={serviceCode} />
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={handleBack} variant="outline">
            {t({ en: 'Back', ur: 'پیچھے' })}
          </Button>
          <Button onClick={handleSubmit} disabled={uploadedFiles.length < requiredDocs.length}>
            {t({ en: 'Submit & Add to Cart', ur: 'جمع کرائیں اور کارٹ میں شامل کریں' })}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
