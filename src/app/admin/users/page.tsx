
'use client';
import { useAllUsers, UserProfile } from "@/hooks/useAllUsers";
import { useLanguage } from "@/context/language-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminUsersPage() {
    const { t } = useLanguage();
    const { users, loading } = useAllUsers();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "User Management", ur: "صارف کا انتظام" })}</CardTitle>
                <CardDescription>{t({ en: "View and manage all registered users.", ur: "تمام رجسٹرڈ صارفین کو دیکھیں اور ان کا نظم کریں۔" })}</CardDescription>
            </CardHeader>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t({ en: "User", ur: "صارف" })}</TableHead>
                        <TableHead>{t({ en: "Contact", ur: "رابطہ" })}</TableHead>
                        <TableHead>{t({ en: "Role", ur: "کردار" })}</TableHead>
                        <TableHead>{t({ en: "Joined On", ur: "شامل ہونے کی تاریخ" })}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            </TableRow>
                        ))
                    ) : users.length > 0 ? (
                        users.map((user: UserProfile) => (
                            <TableRow key={user.uid}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                             <AvatarImage src={`https://placehold.co/40x40.png?text=${user.displayName?.charAt(0)}`} />
                                             <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.displayName}</p>
                                            <p className="text-xs text-muted-foreground">{user.cnic}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p>{user.email}</p>
                                        <p className="text-xs text-muted-foreground">{user.mobileNumber}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{t({ en: user.role, ur: user.role === 'admin' ? 'ایڈمن' : 'صارف' })}</Badge>
                                </TableCell>
                                <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                                {t({ en: "No users found.", ur: "کوئی صارف نہیں ملا۔" })}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}
