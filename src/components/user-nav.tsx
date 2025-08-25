
"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { CreditCard, LogOut, Settings, User, Check, Users, Shield } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"

export function UserNav() {
  const { t } = useLanguage();
  const { user, subAccounts, activeUser, setActiveUser, logout } = useAuth();
  
  if (!user || !activeUser) return null;

  const handleSwitchAccount = (user: any) => {
    setActiveUser(user);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="user avatar" />
            <AvatarFallback>{activeUser?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{activeUser.displayName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {activeUser.email || 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
           {user?.role === 'admin' && (
            <DropdownMenuItem>
              <Link href="/admin" className="flex items-center w-full">
                <Shield className="mr-2 h-4 w-4" />
                <span>{t({ en: "Admin Panel", ur: "ایڈمن پینل" })}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Link href="/family-tax-filing" className="flex items-center w-full">
              <User className="mr-2 h-4 w-4" />
              <span>{t({ en: "Profile Settings", ur: "پروفائل کی ترتیبات" })}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/services" className="flex items-center w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>{t({ en: "Billing", ur: "بلنگ" })}</span>
            </Link>
          </DropdownMenuItem>
           <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Users className="mr-2 h-4 w-4" />
              <span>{t({en: "Switch Account", ur: "اکاؤنٹ تبدیل کریں"})}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleSwitchAccount(user)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.displayName} (Primary)</span>
                   {activeUser.uid === user.uid && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                {subAccounts.map(sub => (
                   <DropdownMenuItem key={sub.uid} onClick={() => handleSwitchAccount(sub)}>
                     <Users className="mr-2 h-4 w-4" />
                    <span>{sub.displayName}</span>
                    {activeUser.uid === sub.uid && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t({ en: "Log out", ur: "لاگ آوٹ" })}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
