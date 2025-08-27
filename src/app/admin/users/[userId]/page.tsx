
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/hooks/useAllUsers';
import { useLanguage } from '@/context/language-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Fingerprint, CalendarIcon, Briefcase } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';


async function fetchUser(userId: string): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        throw new Error('User not found');
    }
    return { uid: userDoc.id, ...userDoc.data() } as UserProfile;
}


export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { userId } = params;
    const { t } = useLanguage();

    const { data: user, isLoading, isError } = useQuery<UserProfile>({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId as string),
        enabled: !!userId,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4"><Skeleton className="h-24 w-24 rounded-full" /><div className="space-y-2"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32" /></div></div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (isError || !user) {
        return <div>Error loading user profile.</div>;
    }


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
                        <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t({en: "Email", ur: "ای میل"})}</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t({en: "Mobile Number", ur: "موبائل نمبر"})}</p>
                                <p className="font-medium">{user.mobileNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                            <Fingerprint className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t({en: "CNIC", ur: "شناختی کارڈ نمبر"})}</p>
                                <p className="font-medium">{user.cnic}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t({en: "Joined On", ur: "شامل ہونے کی تاریخ"})}</p>
                                <p className="font-medium">{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 md:col-span-2">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t({en: "User ID", ur: "صارف ID"})}</p>
                                <p className="font-mono text-xs">{user.uid}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
