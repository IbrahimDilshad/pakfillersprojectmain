
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Home, Bell, LayoutGrid, Calculator, FileQuestion, Landmark, Users, Building, FileUp, Tv, Rss, User, CreditCard } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { useLanguage } from "@/context/language-context"

interface HeaderProps {
  title: string;
}

const pages = [
  { href: "/gst-registration", title: { en: "GST Registration", ur: "جی ایس ٹی رجسٹریشن" }, icon: Landmark },
  { href: "/family-tax-filing", title: { en: "Family Tax Filing", ur: "فیملی ٹیکس فائلنگ" }, icon: Users },
  { href: "/ntn-registration", title: { en: "NTN Registration", ur: "این ٹی این رجسٹریشن" }, icon: FileUp },
  { href: "/iris-profile", title: { en: "IRIS Profile", ur: "IRIS پروفائل" }, icon: User },
  { href: "/business-incorporation", title: { en: "Business Incorporation", ur: "کاروبار کی شمولیت" }, icon: Building },
  { href: "/services", title: { en: "Service Charges", ur: "سروس چارجز" }, icon: CreditCard },
  { href: "/salary-tax-calculator", title: { en: "Salary Tax Calculator", ur: "تنخواہ ٹیکس کیلکولیٹر" }, icon: Calculator },
  { href: "/faqs", title: { en: "FAQs", ur: "اکثر پوچھے گئے سوالات" }, icon: FileQuestion },
  { href: "/blog", title: { en: "Blog & Updates", ur: "بلاگ اور اپڈیٹس" }, icon: Rss },
  { href: "/videos", title: { en: "Videos", ur: "ویڈیوز" }, icon: Tv },
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
