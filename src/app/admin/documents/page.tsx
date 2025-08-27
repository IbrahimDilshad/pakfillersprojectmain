
'use client';
import { useState } from 'react';
import { useLanguage } from "@/context/language-context";
import { useAllDocuments, Document } from "@/hooks/useAllDocuments";
import { useDebounce } from 'use-debounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FileDown, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function AdminDocumentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [docType, setDocType] = useState('all');
  const [status, setStatus] = useState('all');

  const [debouncedSearch] = useDebounce(search, 300);

  const filters = {
    search: debouncedSearch,
    docType,
    status
  };

  const { documents, loading, refetchDocuments } = useAllDocuments(filters);

  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
        const docRef = doc(db, "documents", docId);
        await deleteDoc(docRef);
    },
    onSuccess: () => {
        toast({ title: t({en: "Document Deleted", ur: "دستاویز حذف کر دی گئی"}), description: t({en: "The document has been permanently deleted.", ur: "دستاویز کو مستقل طور پر حذف کر دیا گیا ہے۔"})});
        refetchDocuments();
    },
    onError: (error: any) => {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    }
  });

  return (
    <Card>
        <CardHeader>
            <CardTitle>{t({ en: "All Documents", ur: "تمام دستاویزات" })}</CardTitle>
            <CardDescription>{t({ en: "Search, filter, and manage all user-submitted documents.", ur: "تمام صارف کی جمع کردہ دستاویزات کو تلاش کریں، فلٹر کریں اور ان کا نظم کریں۔" })}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Input placeholder={t({ en: "Search by User ID...", ur: "صارف ID سے تلاش کریں..." })} value={search} onChange={(e) => setSearch(e.target.value)} />
                <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger><SelectValue placeholder={t({en: "Document Type", ur: "دستاویز کی قسم"})} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t({en: "All Types", ur: "تمام اقسام"})}</SelectItem>
                        <SelectItem value="ntn">{t({en: "NTN", ur: "NTN"})}</SelectItem>
                        <SelectItem value="gst">{t({en: "GST", ur: "GST"})}</SelectItem>
                        <SelectItem value="business">{t({en: "Business", ur: "کاروبار"})}</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue placeholder={t({en: "Status", ur: "حیثیت"})} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t({en: "All Statuses", ur: "تمام حیثیتیں"})}</SelectItem>
                        <SelectItem value="pending">{t({en: "Pending", ur: "زیر التواء"})}</SelectItem>
                        <SelectItem value="approved">{t({en: "Approved", ur: "منظور شدہ"})}</SelectItem>
                        <SelectItem value="rejected">{t({en: "Rejected", ur: "مسترد"})}</SelectItem>
                        <SelectItem value="under review">{t({en: "Under Review", ur: "زیر جائزہ"})}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t({ en: "User ID", ur: "صارف ID" })}</TableHead>
                        <TableHead>{t({ en: "Document Type", ur: "دستاویز کی قسم" })}</TableHead>
                        <TableHead>{t({ en: "Title", ur: "عنوان" })}</TableHead>
                        <TableHead>{t({ en: "Status", ur: "حیثیت" })}</TableHead>
                        <TableHead>{t({ en: "Created", ur: "تخلیق شدہ" })}</TableHead>
                        <TableHead className="text-right">{t({ en: "Actions", ur: "کارروائیاں" })}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                            </TableRow>
                        ))
                    ) : documents.map((doc: Document) => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-mono text-xs">{doc.userId}</TableCell>
                            <TableCell>{t(doc.category)}</TableCell>
                            <TableCell>{t(doc.title)}</TableCell>
                            <TableCell><Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}>{t({en: doc.status, ur: doc.status})}</Badge></TableCell>
                            <TableCell>{format(doc.createdAt.toDate(), 'PPP')}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={doc.fileUrl} target="_blank" download>
                                        <FileDown className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon"><Trash2 className="h-5 w-5" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>{t({en: "Are you sure?", ur: "کیا آپ کو یقین ہے؟"})}</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t({en: "This action cannot be undone. This will permanently delete the document.", ur: "یہ عمل واپس نہیں کیا جا سکتا۔ یہ دستاویز کو مستقل طور پر حذف کر دے گا۔"})}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>{t({en: "Cancel", ur: "منسوخ کریں"})}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteMutation.mutate(doc.id)} disabled={deleteMutation.isPending}>
                                        {deleteMutation.isPending ? t({en: "Deleting...", ur: "حذف کیا جا رہا ہے..."}) : t({en: "Delete", ur: "حذف کریں"})}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!loading && documents.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">{t({en: "No documents found.", ur: "کوئی دستاویزات نہیں ملیں۔"})}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
