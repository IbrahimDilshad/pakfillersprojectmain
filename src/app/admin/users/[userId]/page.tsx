
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/hooks/useAllUsers';
import { Document } from '@/hooks/useAllDocuments';
import { useLanguage } from '@/context/language-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Fingerprint, CalendarIcon, Briefcase, File as FileIcon, FileCheck, FileX, FileClock, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

async function fetchUser(userId: string): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        throw new Error('User not found');
    }
    return { uid: userDoc.id, ...userDoc.data() } as UserProfile;
}

async function fetchUserDocuments(userId: string): Promise<Document[]> {
    const q = query(collection(db, 'documents'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const docsSnapshot = await getDocs(q);
    return docsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
}

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { userId } = params;
    const { t } = useLanguage();

    const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery<UserProfile>({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId as string),
        enabled: !!userId,
    });

    const { data: documents = [], isLoading: areDocsLoading } = useQuery<Document[]>({
        queryKey: ['userDocuments', userId],
        queryFn: () => fetchUserDocuments(userId as string),
        enabled: !!userId,
    });

    const isLoading = isUserLoading || areDocsLoading;

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4"><Skeleton className="h-24 w-24 rounded-full" /><div className="space-y-2"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32" /></div></div>
                        <Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                 <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
            </div>
        );
    }
    
    if (isUserError || !user) {
        return <div>Error loading user profile.</div>;
    }

    const documentStats = {
        total: documents.length,
        approved: documents.filter(d => d.status === 'approved').length,
        rejected: documents.filter(d => d.status === 'rejected').length,
        pending: documents.filter(d => d.status === 'pending' || d.status === 'under review').length,
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t({ en: "Back to Users", ur: "صارفین کی فہرست پر واپس" })}
            </Button>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                            <AvatarImage src={`https://placehold.co/100x100.png?text=${user.displayName?.charAt(0)}`} />
                            <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-3xl">{user.displayName}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                             <div className="flex gap-2 mt-2">
                                <Badge variant={user.role === 'admin' ? 'default' : user.role === 'accountant' ? 'secondary' : 'outline'}>{t({ en: `Role: ${user.role}`, ur: `کردار: ${user.role}` })}</Badge>
                                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>{t({ en: `Status: ${user.status || 'active'}`, ur: `حیثیت: ${user.status || 'فعال'}` })}</Badge>
                             </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50"><Mail className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">{t({en: "Email", ur: "ای میل"})}</p><p className="font-medium">{user.email}</p></div></div>
                         <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50"><Phone className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">{t({en: "Mobile Number", ur: "موبائل نمبر"})}</p><p className="font-medium">{user.mobileNumber}</p></div></div>
                        <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50"><Fingerprint className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">{t({en: "CNIC", ur: "شناختی کارڈ نمبر"})}</p><p className="font-medium">{user.cnic}</p></div></div>
                         <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50"><CalendarIcon className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">{t({en: "Joined On", ur: "شامل ہونے کی تاریخ"})}</p><p className="font-medium">{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</p></div></div>
                         <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 md:col-span-2"><Briefcase className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">{t({en: "User ID", ur: "صارف ID"})}</p><p className="font-mono text-xs">{user.uid}</p></div></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>{t({en: "Document Summary", ur: "دستاویز کا خلاصہ"})}</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-4"><div className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t({en:"Total Documents", ur:"کل دستاویزات"})}</CardTitle><FileIcon className="h-4 w-4 text-muted-foreground"/></div><div><div className="text-2xl font-bold">{documentStats.total}</div></div></Card>
                    <Card className="p-4"><div className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t({en:"Pending/Review", ur:"زیر التواء/جائزہ"})}</CardTitle><FileClock className="h-4 w-4 text-muted-foreground"/></div><div><div className="text-2xl font-bold">{documentStats.pending}</div></div></Card>
                    <Card className="p-4"><div className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t({en:"Approved", ur:"منظور شدہ"})}</CardTitle><FileCheck className="h-4 w-4 text-muted-foreground"/></div><div><div className="text-2xl font-bold">{documentStats.approved}</div></div></Card>
                    <Card className="p-4"><div className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t({en:"Rejected", ur:"مسترد"})}</CardTitle><FileX className="h-4 w-4 text-muted-foreground"/></div><div><div className="text-2xl font-bold">{documentStats.rejected}</div></div></Card>
                </CardContent>
                 <Table>
                    <TableHeader><TableRow><TableHead>{t({en:"Doc Type", ur:"قسم"})}</TableHead><TableHead>{t({en:"Status", ur:"حیثیت"})}</TableHead><TableHead>{t({en:"Created", ur:"تخلیق شدہ"})}</TableHead><TableHead className="text-right">{t({en:"File", ur:"فائل"})}</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {documents.length > 0 ? (
                            documents.map(doc => (
                                <TableRow key={doc.id}>
                                    <TableCell>{t(doc.title)}</TableCell>
                                    <TableCell><Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}>{t({en: doc.status, ur: doc.status})}</Badge></TableCell>
                                    <TableCell>{format(doc.createdAt.toDate(), 'PPP')}</TableCell>
                                    <TableCell className="text-right"><Button asChild variant="ghost" size="icon"><Link href={doc.fileUrl} target="_blank"><Download className="h-4 w-4" /></Link></Button></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">{t({en:"No documents found for this user.", ur:"اس صارف کے لیے کوئی دستاویزات نہیں ملیں۔"})}</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
