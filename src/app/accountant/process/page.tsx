
'use client';
import { useState } from 'react';
import { useLanguage } from "@/context/language-context";
import { useTaxFilings, TaxFiling } from "@/hooks/useTaxFilings";
import { useDebounce } from 'use-debounce';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function ProcessPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [taxYear, setTaxYear] = useState('all');
  const [filingType, setFilingType] = useState('all');
  const [status, setStatus] = useState('all');

  const [debouncedSearch] = useDebounce(search, 300);

  const filters = {
    search: debouncedSearch,
    taxYear,
    filingType,
    status
  };

  const { filings, loading, refetchFilings } = useTaxFilings(filters);

  const handleStatusChange = async (filingId: string, newStatus: string) => {
    try {
        const filingRef = doc(db, "taxFilings", filingId);
        await updateDoc(filingRef, { status: newStatus });
        toast({ title: "Status Updated", description: "The filing status has been updated."});
        refetchFilings();
    } catch (error) {
        console.error("Failed to update status:", error);
        toast({ variant: 'destructive', title: "Update Failed", description: "Could not update the filing status."});
    }
  };


  return (
    <Card>
        <CardHeader>
            <CardTitle>{t({ en: "Process Tax Filings", ur: "ٹیکس فائلنگ پر کارروائی کریں" })}</CardTitle>
            <CardDescription>{t({ en: "Review and manage all submitted tax filings.", ur: "جمع کرائی گئی تمام ٹیکس فائلنگ کا جائزہ لیں اور ان کا نظم کریں۔" })}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Input placeholder={t({ en: "Search by name or CNIC...", ur: "نام یا CNIC سے تلاش کریں..." })} value={search} onChange={(e) => setSearch(e.target.value)} />
                <Select value={taxYear} onValueChange={setTaxYear}>
                    <SelectTrigger><SelectValue placeholder={t({en: "Tax Year", ur: "ٹیکس سال"})} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t({en: "All Years", ur: "تمام سال"})}</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={filingType} onValueChange={setFilingType}>
                    <SelectTrigger><SelectValue placeholder={t({en: "Filing Type", ur: "فائلنگ کی قسم"})} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t({en: "All Types", ur: "تمام اقسام"})}</SelectItem>
                        <SelectItem value="personal">{t({en: "Personal", ur: "ذاتی"})}</SelectItem>
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
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t({ en: "Name", ur: "نام" })}</TableHead>
                        <TableHead>{t({ en: "CNIC", ur: "CNIC" })}</TableHead>
                        <TableHead>{t({ en: "Tax Year", ur: "ٹیکس سال" })}</TableHead>
                        <TableHead>{t({ en: "Filing Type", ur: "فائلنگ کی قسم" })}</TableHead>
                        <TableHead>{t({ en: "Assigned To", ur: "تفویض کردہ" })}</TableHead>
                        <TableHead>{t({ en: "Status", ur: "حیثیت" })}</TableHead>
                        <TableHead className="text-right">{t({ en: "Actions", ur: "کارروائیاں" })}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                            </TableRow>
                        ))
                    ) : filings.map((filing: TaxFiling) => (
                        <TableRow key={filing.id}>
                            <TableCell>{filing.userName}</TableCell>
                            <TableCell>{filing.userCnic}</TableCell>
                            <TableCell>{filing.taxYear}</TableCell>
                            <TableCell>{t({en: filing.type, ur: filing.type === 'personal' ? 'ذاتی' : 'کاروبار' })}</TableCell>
                            <TableCell>{filing.assignedTo || 'N/A'}</TableCell>
                            <TableCell><Badge variant={filing.status === 'approved' ? 'default' : filing.status === 'rejected' ? 'destructive' : 'secondary'}>{t({en: filing.status, ur: filing.status === 'pending' ? 'زیر التواء' : filing.status === 'approved' ? 'منظور شدہ' : 'مسترد'})}</Badge></TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleStatusChange(filing.id, 'approved')}>Approve</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(filing.id, 'rejected')}>Reject</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(filing.id, 'pending')}>Mark as Pending</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!loading && filings.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">{t({en: "No tax filings found.", ur: "کوئی ٹیکس فائلنگ نہیں ملی۔"})}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
