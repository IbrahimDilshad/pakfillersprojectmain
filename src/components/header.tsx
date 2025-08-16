import { TopNav } from "@/components/top-nav"
import { UserNav } from "@/components/user-nav"
import { FileText } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
       <Link href="/dashboard" className="flex items-center gap-2 mr-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
                <FileText className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold text-primary">PakFiler</span>
        </Link>
      <TopNav />
      <div className="ml-auto flex items-center gap-4">
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  )
}
