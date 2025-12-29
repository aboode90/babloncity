'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { signIn } from 'next-auth/react';

const registerSchema = z.object({
  username: z.string().min(3, { message: 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل.' }),
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صحيح.' }),
  password: z.string().min(6, { message: 'يجب أن لا تقل كلمة المرور عن 6 أحرف.' }),
  referralCode: z.string().optional(), // Add optional referral code
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      referralCode: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      // Step 1: Call the local API to register the user with PlayFab, passing the referral code
      await axios.post('/api/auth/register', values);

      // Step 2: Automatically sign the user in after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.ok) {
        toast({
          title: 'تم إنشاء الحساب بنجاح!',
          description: 'أهلاً بك في بابلون بلوك. سيتم توجيهك الآن.',
        });
        router.push('/dashboard');
      } else {
        throw new Error('فشل تسجيل الدخول بعد إنشاء الحساب.');
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'حدث خطأ غير متوقع. يرى المحاولة مرة أخرى.';
      toast({
        variant: 'destructive',
        title: 'فشل إنشاء الحساب',
        description: errorMessage,
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-glass shadow-2xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-3 mb-4">
            <Image src="/logo.png" alt="شعار بابلون بلوك" width={40} height={40} />
            <CardTitle className="text-2xl font-headline">إنشاء حساب</CardTitle>
          </div>
          <CardDescription>انضم إلى عالم بابلون بلوك اليوم!</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid w-full items-center gap-4 text-right">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>اسم المستخدم</FormLabel>
                      <FormControl>
                        <Input placeholder="اختر اسم مستخدم رائع" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="أنشئ كلمة مرور قوية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>رمز الإحالة (اختياري)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل الرمز إذا كان لديك واحد" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                هل لديك حساب بالفعل؟{' '}
                <Link href="/login" className="underline text-primary font-medium">
                  تسجيل الدخول
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
