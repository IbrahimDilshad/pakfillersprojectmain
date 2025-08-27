
'use client';
import { useAllUsers, UserProfile } from "@/hooks/useAllUsers";
import { useLanguage } from "@/context/language-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminUsersPage() {
    const { t } = useLanguage();
    const { users, loading, refetchUsers } = useAllUsers();
    const { toast } = useToast();

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'user' | 'accountant') => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role: newRole });
            toast({ title: "Role Updated", description: "The user's role has been updated." });
            refetchUsers();
        } catch (error) {
            console.error("Failed to update role:", error);
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not update the user's role." });
        }
    };
    
    const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status: newStatus });
            toast({ title: "Status Updated", description: "The user's status has been updated." });
            refetchUsers();
        } catch (error) {
            console.error("Failed to update status:", error);
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not update the user's status." });
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "User Management", ur: "صارف کا انتظام" })}</CardTitle>
                <CardDescription>{t({ en: "View and manage all registered users.", ur: "تمام رجسٹرڈ صارفین کو دیکھیں اور ان کا نظم کریں۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t({ en: "User", ur: "صارف" })}</TableHead>
                            <TableHead>{t({ en: "Contact", ur: "رابطہ" })}</TableHead>
                            <TableHead>{t({ en: "Role", ur: "کردار" })}</TableHead>
                            <TableHead>{t({ en: "Status", ur: "حیثیت" })}</TableHead>
                            <TableHead>{t({ en: "Joined On", ur: "شامل ہونے کی تاریخ" })}</TableHead>
                            <TableHead className="text-right">{t({ en: "Actions", ur: "کارروائیاں" })}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
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
                                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'accountant' ? 'secondary' : 'outline'}>
                                            {t({ en: user.role, ur: user.role === 'admin' ? 'ایڈمن' : user.role === 'accountant' ? 'اکاؤنٹنٹ' : 'صارف' })}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                            {t({ en: user.status || 'active', ur: (user.status || 'active') === 'active' ? 'فعال' : 'معطل' })}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/users/${user.uid}`} className="flex items-center">
                                                        <Eye className="mr-2 h-4 w-4" />{t({en: "View Profile", ur: "پروفائل دیکھیں"})}
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>{t({en: "Change Role", ur: "کردار تبدیل کریں"})}</DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'user')}>User</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'admin')}>Admin</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'accountant')}>Accountant</DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                {user.status === 'active' ? (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.uid, 'suspended')}>
                                                        <UserX className="mr-2 h-4 w-4" />{t({en: "Suspend User", ur: "صارف کو معطل کریں"})}
                                                    </DropdownMenuItem>
                                                ) : (
                                                     <DropdownMenuItem onClick={() => handleStatusChange(user.uid, 'active')}>
                                                         <UserCheck className="mr-2 h-4 w-4" />{t({en: "Activate User", ur: "صارف کو فعال کریں"})}
                                                     </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    {t({ en: "No users found.", ur: "کوئی صارف نہیں ملا۔" })}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
