'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  CircleUserRound,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Trophy,
  Users,
  PanelLeft,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const adminNavItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
  { href: '/admin/users', icon: Users, label: 'User Management' },
  { href: '/admin/raffles', icon: Trophy, label: 'Raffle Management' },
];

function SidebarNav({ items }: { items: typeof adminNavItems }) {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-1">
      {items.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
              pathname.startsWith(item.href) ? 'bg-accent text-accent-foreground' : 'transparent'
            }`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarContent() {
    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
                    <Gamepad2 className="h-6 w-6 text-primary" />
                    <span>Babylon Block</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <div className="px-4 mb-2 text-sm font-medium text-muted-foreground">Admin Panel</div>
                <div className="px-2">
                    <SidebarNav items={adminNavItems} />
                </div>
                 <div className="px-4 my-2 mt-4 text-sm font-medium text-muted-foreground">Navigation</div>
                 <div className="px-2">
                    <Link href="/dashboard">
                        <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent">
                            <Home className="mr-2 h-4 w-4" />
                            <span>Go to App</span>
                        </span>
                    </Link>
                 </div>
            </div>
            <div className="mt-auto p-4 border-t">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="overflow-hidden rounded-full h-10 w-10">
                        <CircleUserRound className="h-5 w-5"/>
                    </Button>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Admin User</span>
                        <span className="text-xs text-muted-foreground">admin@babylonblock.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = adminNavItems.find(item => pathname.startsWith(item.href))?.label || 'Admin';

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card/50 md:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <div className='w-full flex-1'>
            <h1 className="font-headline text-xl font-semibold">{pageTitle}</h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <CircleUserRound className="h-6 w-6"/>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
