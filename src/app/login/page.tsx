import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gamepad2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-glass shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-headline">بابلون بلوك</CardTitle>
          </div>
          <CardDescription>سجل الدخول إلى حسابك للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4 text-right">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" placeholder="كلمة المرور الخاصة بك" />
              </div>
            </div>
             <div className="flex items-center justify-end mt-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    هل نسيت كلمة المرور؟
                </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">تسجيل الدخول</Button>
          <p className="text-sm text-center text-muted-foreground">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="underline text-primary font-medium">
              إنشاء حساب
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
