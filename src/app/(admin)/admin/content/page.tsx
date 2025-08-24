
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/language-context";
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Pencil, PlusCircle, BookOpen, Tv, FileQuestion, CreditCard, DollarSign } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFormPrices, FormPrice } from '@/hooks/useFormPrices';
import { useServices, Service } from '@/hooks/useServices';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import { useVideos, Video } from '@/hooks/useVideos';
import { useFaqs, Faq } from '@/hooks/useFaqs';
import { format } from 'date-fns';

type EditableContent = Service | BlogPost | Video | Faq | FormPrice;
type ContentType = 'services' | 'blogPosts' | 'videos' | 'faqs' | 'formPrices';

const contentConfig: Record<ContentType, {
    title: {en: string, ur: string};
    description: {en: string, ur: string};
    icon: React.ElementType;
    useHook: () => { data: any[], loading: boolean, setData?: any };
    form: React.FC<{ item: any | null, onSave: () => void }>;
    columns: { header: {en: string, ur: string}; accessor: (item: any) => React.ReactNode }[];
}> = {
    services: {
        title: { en: 'Manage Services', ur: 'خدمات کا نظم کریں' },
        description: { en: 'Add, edit, or delete service listings.', ur: 'سروس کی فہرستیں شامل کریں، ترمیم کریں یا حذف کریں۔' },
        icon: CreditCard,
        useHook: () => ({ data: useServices().services, loading: useServices().loading, setData: useServices().setServices }),
        form: ServiceForm,
        columns: [
            { header: { en: 'Title', ur: 'عنوان' }, accessor: (item: Service) => <T text={item.title} /> },
            { header: { en: 'Price', ur: 'قیمت' }, accessor: (item: Service) => `PKR ${item.price.toLocaleString()}` },
            { header: { en: 'Time', ur: 'وقت' }, accessor: (item: Service) => <T text={item.completionTime} /> },
        ]
    },
    formPrices: {
        title: { en: 'Manage Form Prices', ur: 'فارم کی قیمتوں کا نظم کریں' },
        description: { en: 'Set or update the prices for different forms and services.', ur: 'مختلف فارموں اور خدمات کے لیے قیمتیں مقرر یا اپ ڈیٹ کریں۔' },
        icon: DollarSign,
        useHook: () => ({ data: useFormPrices().formPrices, loading: useFormPrices().loading, setData: useFormPrices().setFormPrices }),
        form: FormPriceForm,
        columns: [
            { header: { en: 'Form/Service Name', ur: 'فارم/سروس کا نام' }, accessor: (item: FormPrice) => <T text={item.name} /> },
            { header: { en: 'Price', ur: 'قیمت' }, accessor: (item: FormPrice) => `PKR ${item.price.toLocaleString()}` },
        ]
    },
    blogPosts: {
        title: { en: 'Manage Blog Posts', ur: 'بلاگ پوسٹس کا نظم کریں' },
        description: { en: 'Create, edit, or delete blog posts.', ur: 'بلاگ پوسٹس بنائیں، ترمیم کریں یا حذف کریں۔' },
        icon: BookOpen,
        useHook: () => ({ data: useBlogPosts().posts, loading: useBlogPosts().loading, setData: useBlogPosts().setPosts }),
        form: BlogPostForm,
        columns: [
            { header: { en: 'Title', ur: 'عنوان' }, accessor: (item: BlogPost) => <T text={item.title} /> },
            { header: { en: 'Date', ur: 'تاریخ' }, accessor: (item: BlogPost) => format(item.createdAt.toDate(), 'PPP') },
        ]
    },
    videos: {
        title: { en: 'Manage Videos', ur: 'ویڈیوز کا نظم کریں' },
        description: { en: 'Add, edit, or delete video tutorials.', ur: 'ویڈیو ٹیوٹوریل شامل کریں، ترمیم کریں یا حذف کریں۔' },
        icon: Tv,
        useHook: () => ({ data: useVideos().videos, loading: useVideos().loading, setData: useVideos().setVideos }),
        form: VideoForm,
        columns: [
            { header: { en: 'Title', ur: 'عنوان' }, accessor: (item: Video) => <T text={item.title} /> },
            { header: { en: 'Source', ur: 'ذریعہ' }, accessor: (item: Video) => <a href={item.src} target='_blank' rel="noreferrer" className="text-primary underline">{item.src}</a> },
        ]
    },
    faqs: {
        title: { en: 'Manage FAQs', ur: 'اکثر پوچھے گئے سوالات کا نظم کریں' },
        description: { en: 'Add, edit, or delete frequently asked questions.', ur: 'اکثر پوچھے گئے سوالات شامل کریں، ترمیم کریں یا حذف کریں۔' },
        icon: FileQuestion,
        useHook: () => ({ data: useFaqs().faqs, loading: useFaqs().loading, setData: useFaqs().setFaqs }),
        form: FaqForm,
        columns: [
            { header: { en: 'Question', ur: 'سوال' }, accessor: (item: Faq) => <T text={item.question} /> },
        ]
    }
};

const T = ({ text }: { text: { en: string, ur: string } }) => {
  const { language } = useLanguage();
  return <>{text[language] || text['en']}</>;
}


export default function AdminContentPage() {
    const { t } = useLanguage();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<ContentType>('services');
    
    const config = contentConfig[activeTab];
    const { data, loading, setData } = config.useHook();

    const handleAddNew = () => {
        setCurrentItem(null);
        setDialogOpen(true);
    };

    const handleEdit = (item: any) => {
        setCurrentItem(item);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, activeTab, id));
            // This is optimistic UI update
            if(setData) {
                setData((prev: any[]) => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    };
    
    const FormComponent = config.form;

    return (
        <>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)}>
                <TabsList className="mb-4">
                    {Object.keys(contentConfig).map(key => {
                        const tabConfig = contentConfig[key as ContentType];
                        return (
                            <TabsTrigger key={key} value={key} className="gap-2">
                                <tabConfig.icon />
                                {t(tabConfig.title)}
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>{t(config.title)}</CardTitle>
                                <CardDescription>{t(config.description)}</CardDescription>
                            </div>
                            <Button onClick={handleAddNew}><PlusCircle className="mr-2" />{t({ en: "Add New", ur: "نیا شامل کریں" })}</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {config.columns.map((col, i) => (
                                        <TableHead key={i}>{t(col.header)}</TableHead>
                                    ))}
                                    <TableHead className="text-right">{t({ en: "Actions", ur: "کاروائیاں" })}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {config.columns.map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
                                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : data.length === 0 ? (
                                    <TableRow><TableCell colSpan={config.columns.length + 1} className="text-center h-24">{t({ en: "No items found.", ur: "کوئی آئٹم نہیں ملا۔" })}</TableCell></TableRow>
                                ) : (
                                    data.map(item => (
                                        <TableRow key={item.id}>
                                            {config.columns.map((col, i) => <TableCell key={i}>{col.accessor(item)}</TableCell>)}
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentItem ? t({en: 'Edit Item', ur: 'آئٹم میں ترمیم کریں'}) : t({en: 'Add New Item', ur: 'نیا آئٹم شامل کریں'})}</DialogTitle>
                    </DialogHeader>
                    <FormComponent item={currentItem} onSave={() => setDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}


function FormPriceForm({ item, onSave }: { item: FormPrice | null, onSave: () => void }) {
    const { t } = useLanguage();
    const [nameEn, setNameEn] = useState('');
    const [nameUr, setNameUr] = useState('');
    const [price, setPrice] = useState('');
    const [serviceId, setServiceId] = useState('');

    useEffect(() => {
        if (item) {
            setServiceId(item.id);
            setNameEn(item.name.en);
            setNameUr(item.name.ur);
            setPrice(String(item.price));
        } else {
            setServiceId(''); setNameEn(''); setNameUr(''); setPrice('');
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name: { en: nameEn, ur: nameUr },
            price: Number(price),
        };
        try {
            if (item) {
                // Cannot update ID
                await updateDoc(doc(db, 'formPrices', item.id), data);
            } else {
                // Use serviceId as the document ID
                await setDoc(doc(db, 'formPrices', serviceId), data);
            }
            onSave();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>{t({ en: "Service ID (e.g., 'personal_tax_filing')", ur: "سروس آئی ڈی" })}</Label>
                <Input value={serviceId} onChange={e => setServiceId(e.target.value)} required disabled={!!item} />
            </div>
            <div className="space-y-2">
                <Label>{t({ en: "Name (English)", ur: "نام (انگریزی)" })}</Label>
                <Input value={nameEn} onChange={e => setNameEn(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>{t({ en: "Name (Urdu)", ur: "نام (اردو)" })}</Label>
                <Input value={nameUr} onChange={e => setNameUr(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>{t({ en: "Price (PKR)", ur: "قیمت (PKR)" })}</Label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </form>
    );
}

// Similar CRUD forms for other content types

function ServiceForm({ item, onSave }: { item: Service | null, onSave: () => void }) {
    const { t } = useLanguage();
    const [titleEn, setTitleEn] = useState('');
    const [titleUr, setTitleUr] = useState('');
    const [price, setPrice] = useState('');
    const [completionTimeEn, setCompletionTimeEn] = useState('');
    const [completionTimeUr, setCompletionTimeUr] = useState('');
    const [detailsEn, setDetailsEn] = useState('');
    const [detailsUr, setDetailsUr] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');

    useEffect(() => {
        if (item) {
            setTitleEn(item.title.en); setTitleUr(item.title.ur);
            setPrice(String(item.price));
            setCompletionTimeEn(item.completionTime.en); setCompletionTimeUr(item.completionTime.ur);
            setDetailsEn(item.details.en); setDetailsUr(item.details.ur);
            setWhatsappNumber(item.whatsappNumber);
        } else {
            setTitleEn(''); setTitleUr(''); setPrice('');
            setCompletionTimeEn(''); setCompletionTimeUr('');
            setDetailsEn(''); setDetailsUr(''); setWhatsappNumber('');
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            title: { en: titleEn, ur: titleUr },
            price: Number(price),
            completionTime: { en: completionTimeEn, ur: completionTimeUr },
            details: { en: detailsEn, ur: detailsUr },
            whatsappNumber,
            createdAt: item?.createdAt || serverTimestamp()
        };
        try {
            if (item) {
                await updateDoc(doc(db, 'services', item.id), data);
            } else {
                await addDoc(collection(db, 'services'), data);
            }
            onSave();
        } catch (error) {
            console.error(error);
        }
    };
    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Title (EN)</Label>
                    <Input value={titleEn} onChange={e => setTitleEn(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label>Title (UR)</Label>
                    <Input value={titleUr} onChange={e => setTitleUr(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label>Price (PKR)</Label>
                    <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label>Completion Time (EN)</Label>
                    <Input value={completionTimeEn} onChange={e => setCompletionTimeEn(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label>Completion Time (UR)</Label>
                    <Input value={completionTimeUr} onChange={e => setCompletionTimeUr(e.target.value)} required />
                </div>
                 <div className="space-y-2 col-span-2">
                    <Label>Details (EN)</Label>
                    <Textarea value={detailsEn} onChange={e => setDetailsEn(e.target.value)} required />
                </div>
                 <div className="space-y-2 col-span-2">
                    <Label>Details (UR)</Label>
                    <Textarea value={detailsUr} onChange={e => setDetailsUr(e.target.value)} required />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </form>
    )
}

function BlogPostForm({ item, onSave }: { item: BlogPost | null, onSave: () => void }) {
    const [titleEn, setTitleEn] = useState('');
    const [titleUr, setTitleUr] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionUr, setDescriptionUr] = useState('');
    const [image, setImage] = useState('');
    const [hint, setHint] = useState('');
    const [href, setHref] = useState('');

    useEffect(() => {
        if (item) {
            setTitleEn(item.title.en); setTitleUr(item.title.ur);
            setDescriptionEn(item.description.en); setDescriptionUr(item.description.ur);
            setImage(item.image);
            setHint(item.hint);
            setHref(item.href || '');
        } else {
           setTitleEn(''); setTitleUr(''); setDescriptionEn(''); setDescriptionUr('');
           setImage('https://placehold.co/600x400.png'); setHint(''); setHref('');
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            title: { en: titleEn, ur: titleUr },
            description: { en: descriptionEn, ur: descriptionUr },
            image,
            hint,
            href,
            createdAt: item?.createdAt || serverTimestamp()
        };
        try {
            if (item) {
                await updateDoc(doc(db, 'blogPosts', item.id), data);
            } else {
                await addDoc(collection(db, 'blogPosts'), data);
            }
            onSave();
        } catch (error) { console.error(error); }
    };
    
     return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title (EN)</Label><Input value={titleEn} onChange={e => setTitleEn(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Title (UR)</Label><Input value={titleUr} onChange={e => setTitleUr(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Description (EN)</Label><Textarea value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Description (UR)</Label><Textarea value={descriptionUr} onChange={e => setDescriptionUr(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Image URL</Label><Input value={image} onChange={e => setImage(e.target.value)} required /></div>
                <div className="space-y-2"><Label>AI Hint (for image)</Label><Input value={hint} onChange={e => setHint(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Blog Post Link (href)</Label><Input value={href} onChange={e => setHref(e.target.value)} /></div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </form>
    );
}

function VideoForm({ item, onSave }: { item: Video | null, onSave: () => void }) {
    const [titleEn, setTitleEn] = useState('');
    const [titleUr, setTitleUr] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionUr, setDescriptionUr] = useState('');
    const [src, setSrc] = useState('');

    useEffect(() => {
        if (item) {
            setTitleEn(item.title.en); setTitleUr(item.title.ur);
            setDescriptionEn(item.description.en); setDescriptionUr(item.description.ur);
            setSrc(item.src);
        } else {
            setTitleEn(''); setTitleUr(''); setDescriptionEn(''); setDescriptionUr(''); setSrc('');
        }
    }, [item]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            title: { en: titleEn, ur: titleUr },
            description: { en: descriptionEn, ur: descriptionUr },
            src,
            createdAt: item?.createdAt || serverTimestamp()
        };
        try {
            if (item) {
                await updateDoc(doc(db, 'videos', item.id), data);
            } else {
                await addDoc(collection(db, 'videos'), data);
            }
            onSave();
        } catch (error) { console.error(error); }
    };
    
     return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title (EN)</Label><Input value={titleEn} onChange={e => setTitleEn(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Title (UR)</Label><Input value={titleUr} onChange={e => setTitleUr(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Description (EN)</Label><Textarea value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Description (UR)</Label><Textarea value={descriptionUr} onChange={e => setDescriptionUr(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Video Embed URL (src)</Label><Input value={src} onChange={e => setSrc(e.target.value)} required /></div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </form>
    );
}

function FaqForm({ item, onSave }: { item: Faq | null, onSave: () => void }) {
    const [questionEn, setQuestionEn] = useState('');
    const [questionUr, setQuestionUr] = useState('');
    const [answerEn, setAnswerEn] = useState('');
    const [answerUr, setAnswerUr] = useState('');

     useEffect(() => {
        if (item) {
            setQuestionEn(item.question.en); setQuestionUr(item.question.ur);
            setAnswerEn(item.answer.en); setAnswerUr(item.answer.ur);
        } else {
            setQuestionEn(''); setQuestionUr(''); setAnswerEn(''); setAnswerUr('');
        }
    }, [item]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            question: { en: questionEn, ur: questionUr },
            answer: { en: answerEn, ur: answerUr },
            createdAt: item?.createdAt || serverTimestamp()
        };
        try {
            if (item) {
                await updateDoc(doc(db, 'faqs', item.id), data);
            } else {
                await addDoc(collection(db, 'faqs'), data);
            }
            onSave();
        } catch (error) { console.error(error); }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2"><Label>Question (EN)</Label><Input value={questionEn} onChange={e => setQuestionEn(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Question (UR)</Label><Input value={questionUr} onChange={e => setQuestionUr(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Answer (EN)</Label><Textarea value={answerEn} onChange={e => setAnswerEn(e.target.value)} required /></div>
                <div className="space-y-2 col-span-2"><Label>Answer (UR)</Label><Textarea value={answerUr} onChange={e => setAnswerUr(e.target.value)} required /></div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </form>
    );
}

