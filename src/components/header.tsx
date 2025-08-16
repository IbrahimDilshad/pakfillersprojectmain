import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Home, Bell, LayoutGrid, FileSignature, FileUp, User, CreditCard } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { useLanguage } from "@/context/language-context"

interface HeaderProps {
  title: string;
}

const pages = [
  { href: "/filing", title: { en: "Tax Filing", ur: "ٹیکس فائلنگ" }, icon: FileSignature },
  { href: "/documents", title: { en: "Documents", ur: "دستاویزات" }, icon: FileUp },
  { href: "/profile", title: { en: "IRIS Profile", ur: "IRIS پروفائل" }, icon: User },
  { href: "/services", title: { en: "Service Charges", ur: "سروس چارجز" }, icon: CreditCard },
  { href: "/forms/income-tax-return", title: { en: 'Income Tax Return', ur: 'انکم ٹیکس ریٹرن' }, icon: FileText },
  { href: "/forms/sales-tax-return", title: { en: 'Sales Tax Return', ur: 'سیلز ٹیکس ریٹرن' }, icon: FileText },
  { href: "/forms/wealth-statement", title: { en: 'Wealth Statement', ur: 'دولت کا بیان' }, icon: FileText },
  { href: "/forms/withholding-tax-statement", title: { en: 'Withholding Tax', ur: 'ودہولڈنگ ٹیکس' }, icon: FileText },
]

export function Header({ title }: HeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
       <Link href="/dashboard" className="flex items-center gap-2 mr-auto">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
                <FileText className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold text-primary">PakFiler</span>
        </Link>
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
            <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
        <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <LayoutGrid className="h-5 w-5" />
                    <span className="sr-only">Pages</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <div className="grid grid-cols-2 gap-2 p-2">
                {pages.map((page) => (
                    <Link href={page.href} key={page.href} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="bg-primary/10 text-primary p-3 rounded-full mb-1">
                            <page.icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-foreground text-center">{t(page.title)}</span>
                    </Link>
                ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>

        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  )
}
