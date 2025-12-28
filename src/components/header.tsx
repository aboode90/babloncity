import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 bg-transparent absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="https://i.imgur.com/gC4gA5D.png" alt="شعار بابلون بلوك" width={40} height={40} />
          <span className="text-xl font-headline font-bold text-foreground">
            بابلون بلوك
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            الميزات
          </Link>
          <Link href="/#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            الأسئلة الشائعة
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
          <Button asChild>
            <Link href="/register">إنشاء حساب</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
