
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAllUsers, UserProfile } from "@/hooks/useAllUsers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import type { Role, AuthUser } from "@/context/auth-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { adminNavItems } from "../../layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function ManagePermissionsDialog({ user, onPermissionsUpdate }: { user: UserProfile; onPermissionsUpdate: (userId: string, permissions: any) => void; }) {
    const { t } = useLanguage();
    const [permissions, setPermissions] = useState(user.permissions || {});
    const [isOpen, setIsOpen] = useState(false);

    const handlePermissionChange = (key: string, value: boolean) => {
        setPermissions(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onPermissionsUpdate(user.uid, permissions);
        setIsOpen(false);
    };

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><ShieldCheck className="mr-2 h-4 w-4" />{t({en: "Permissions", ur: "اجازتیں"})}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t({en: "Manage Permissions for", ur: "کے لیے اجازتوں کا نظم کریں"})} {user.displayName}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {adminNavItems.map(item => (
                        <div key={item.permissionKey} className="flex items-center space-x-2">
                           <Checkbox 
                                id={`${user.uid}-${item.permissionKey}`}
                                checked={permissions[item.permissionKey as keyof typeof permissions] || false}
                                onCheckedChange={(checked) => handlePermissionChange(item.permissionKey, !!checked)}
                           />
                           <Label htmlFor={`${user.uid}-${item.permissionKey}`}>{t(item.label)}</Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">{t({en: "Cancel", ur: "منسوخ"})}</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>{t({en: "Save", ur: "محفوظ کریں"})}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { users, loading, refetchUsers } = useAllUsers();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const isSuperAdmin = currentUser?.email === 'admin@example.com';

  const handleRoleChange = async (userId: string, newRole: Role) => {
    if (!isSuperAdmin) {
        toast({ variant: "destructive", title: "Permission Denied", description: "Only the super admin can change roles." });
        return;
    }
    setIsUpdating(userId);
    try {
        const userDocRef = doc(db, 'users', userId);
        // When changing a role to 'admin', initialize their permissions object.
        const permissions = newRole === 'admin' ? {
            dashboard: true,
            orders: false,
            content: false,
            payments: false,
            chat: false,
            users: false,
            reports: false,
            config: false,
        } : {};
        
        await updateDoc(userDocRef, { role: newRole, permissions });
        
        refetchUsers();

        toast({ title: "Success", description: "User role updated. Note: Custom claims must be set via a backend process for new role to take full effect."});
    } catch (error) {
        console.error("Error updating user role:", error);
        toast({ variant: 'destructive', title: "Error", description: "Failed to update user role."});
    } finally {
        setIsUpdating(null);
    }
  };

  const handlePermissionsUpdate = async (userId: string, permissions: any) => {
     if (!isSuperAdmin) {
        toast({ variant: "destructive", title: "Permission Denied", description: "Only the super admin can change permissions." });
        return;
    }
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { permissions });
        refetchUsers();
        toast({ title: "Success", description: "Permissions updated successfully."});
    } catch (error) {
         console.error("Error updating permissions:", error);
        toast({ variant: 'destructive', title: "Error", description: "Failed to update permissions."});
    }
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>{t({ en: "User Management", ur: "صارف کا انتظام" })}</CardTitle>
          <CardDescription>{t({ en: "View and manage all registered users.", ur: "تمام رجسٹرڈ صارفین کو دیکھیں اور ان کا نظم کریں۔" })}</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert className="mb-6">
                <Terminal className="h-4 w-4" />
                <AlertTitle>{t({en: "Admin Role Management", ur: "ایڈمن رول مینجمنٹ"})}</AlertTitle>
                <AlertDescription>
                    {t({en: "To grant a user full administrative privileges (like listing all chats), you must set a custom claim on their account using a backend environment or the Firebase Admin SDK. This is a security measure to protect sensitive data.", ur: "کسی صارف کو مکمل انتظامی مراعات دینے کے لیے (جیسے تمام چیٹس کی فہرست بنانا)، آپ کو بیک اینڈ ماحول یا فائر بیس ایڈمن ایس ڈی کے کا استعمال کرتے ہوئے ان کے اکاؤنٹ پر ایک کسٹم کلیم سیٹ کرنا ہوگا۔ یہ حساس ڈیٹا کی حفاظت کے لیے ایک حفاظتی اقدام ہے۔"})}
                </AlertDescription>
            </Alert>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t({en: "Name", ur: "نام"})}</TableHead>
                  <TableHead>{t({en: "Email", ur: "ای میل"})}</TableHead>
                  <TableHead>{t({en: "Joined On", ur: "شمولیت کی تاریخ"})}</TableHead>
                  <TableHead>{t({en: "Role", ur: "کردار"})}</TableHead>
                  <TableHead className="text-right">{t({en: "Actions", ur: "کاروائیاں"})}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                       <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : users.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                    <TableCell>
                        <Select 
                            value={user.role} 
                            onValueChange={(newRole: Role) => handleRoleChange(user.uid, newRole)}
                            disabled={isUpdating === user.uid || !isSuperAdmin || user.email === 'admin@example.com'}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="accountant">Accountant</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                     <TableCell className="text-right">
                        {user.role === 'admin' && isSuperAdmin && user.email !== 'admin@example.com' && (
                           <ManagePermissionsDialog user={user} onPermissionsUpdate={handlePermissionsUpdate} />
                        )}
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
           </Table>
        </CardContent>
      </Card>
  );
}
