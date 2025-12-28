import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gamepad2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-glass shadow-2xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 mb-4">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-headline">إنشاء حساب</CardTitle>
          </div>
          <CardDescription>انضم إلى عالم بابلون بلوك اليوم!</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4 text-right">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input id="username" placeholder="اختر اسم مستخدم رائع" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" placeholder="أنشئ كلمة مرور قوية" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">إنشاء حساب</Button>
          <p className="text-sm text-center text-muted-foreground">
            هل لديك حساب بالفعل؟{' '}
            <Link href="/login" className="underline text-primary font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
