
'use client';
import { useState } from 'react';
import { useLanguage } from "@/context/language-context";
import { useAllDocuments, Document } from "@/hooks/useAllDocuments";
import { useDebounce } from 'use-debounce';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FileDown } from 'lucide-react';
import Link from 'next/link';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ReviewPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
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

  const handleStatusChange = async (docId: string, newStatus: string) => {
    try {
        const docRef = doc(db, "documents", docId);
        await updateDoc(docRef, { status: newStatus });
        toast({ title: "Status Updated", description: "The document status has been updated."});
        refetchDocuments();
    } catch (error) {
        console.error("Failed to update status:", error);
        toast({ variant: 'destructive', title: "Update Failed", description: "Could not update the document status."});
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>{t({ en: "Document Review", ur: "دستاویز کا جائزہ" })}</CardTitle>
            <CardDescription>{t({ en: "Review and manage all user-submitted documents.", ur: "صارف کی جمع کردہ تمام دستاویزات کا جائزہ لیں اور ان کا نظم کریں۔" })}</CardDescription>
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
                        <TableHead>{t({ en: "Type", ur: "قسم" })}</TableHead>
                        <TableHead>{t({ en: "Status", ur: "حیثیت" })}</TableHead>
                        <TableHead>{t({ en: "File", ur: "فائل" })}</TableHead>
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
                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                            </TableRow>
                        ))
                    ) : documents.map((doc: Document) => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-mono text-xs">{doc.userId}</TableCell>
                            <TableCell>{t(doc.category)}</TableCell>
                            <TableCell>{t(doc.title)}</TableCell>
                            <TableCell><Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}>{t({en: doc.status, ur: doc.status})}</Badge></TableCell>
                            <TableCell>
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={doc.fileUrl} target="_blank" download>
                                        <FileDown className="h-5 w-5" />
                                    </Link>
                                </Button>
                            </TableCell>
                            <TableCell>{format(doc.createdAt.toDate(), 'PPP')}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleStatusChange(doc.id, 'approved')}>Approve</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(doc.id, 'rejected')}>Reject</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(doc.id, 'under review')}>Set to Under Review</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(doc.id, 'pending')}>Set to Pending</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!loading && documents.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">{t({en: "No documents found.", ur: "کوئی دستاویزات نہیں ملیں۔"})}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
