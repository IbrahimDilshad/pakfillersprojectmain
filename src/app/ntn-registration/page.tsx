
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { Download, File as FileIcon, Trash2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  file: File;
  type: string;
}

const requiredDocs = [
  { id: 'cnicFront', title: { en: 'Front of CNIC', ur: 'شناختی کارڈ کا سامنے کا حصہ' } },
  { id: 'cnicBack', title: { en: 'Back of CNIC', ur: 'شناختی کارڈ کا پچھلا حصہ' } },
];

export default function NtnRegistrationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
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
    toast({
        title: "Added to Cart (Simulation)",
        description: "NTN Registration service has been added to your cart."
    });
    router.push('/cart');
  };

  return (
    <AppLayout pageTitle={t({ en: 'NTN Registration', ur: 'این ٹی این رجسٹریشن' })}>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: 'Upload CNIC Copies', ur: 'شناختی کارڈ کی کاپیاں اپ لوڈ کریں' })}</CardTitle>
            <CardDescription>
              {t({
                en: 'Please upload clear copies of the front and back of your CNIC.',
                ur: 'براہ کرم اپنے شناختی کارڈ کے سامنے اور پیچھے کی واضح کاپیاں اپ لوڈ کریں۔',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {requiredDocs.map(doc => {
                const isUploaded = uploadedFiles.some(f => f.type === doc.id);
                return (
                  <div key={doc.id}>
                    <label htmlFor={`file-upload-${doc.id}`} className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploaded ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent'}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-2">
                        <UploadCloud className={`w-10 h-10 mb-3 ${isUploaded ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`text-base ${isUploaded ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{t(doc.title)}</p>
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
