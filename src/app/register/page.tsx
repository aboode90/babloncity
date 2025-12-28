'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser, initiateEmailSignUp, setDocumentNonBlocking, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Gamepad2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';

const registerSchema = z.object({
  username: z.string().min(3, { message: 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل.' }),
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صحيح.' }),
  password: z.string().min(6, { message: 'يجب أن لا تقل كلمة المرور عن 6 أحرف.' }),
});

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const {
    formState: { isSubmitting },
    getValues,
  } = form;

  useEffect(() => {
    if (!isUserLoading && user) {
        // This effect runs when the user state changes.
        // If the user has just been created and authenticated...
        const values = getValues();
        const userDocRef = doc(firestore, 'users', user.uid);
        
        // Create a user profile document in Firestore.
        // Using set with merge prevents overwriting if it somehow already exists.
        setDocumentNonBlocking(userDocRef, {
            id: user.uid,
            playFabId: '', // You can add this later if needed
            email: user.email,
            username: values.username,
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isAdmin: false,
            tickets: 0,
            points: 0,
        }, { merge: true });
        
        router.push('/dashboard');
    }
}, [user, isUserLoading, router, firestore, getValues]);


  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    initiateEmailSignUp(auth, values.email, values.password);
    toast({
      title: 'جاري إنشاء الحساب...',
      description: 'سيتم تسجيل دخولك وتوجيهك قريباً.',
    });
  };
  
  if (isUserLoading || user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>جاري التحميل...</p>
        </div>
    );
  }

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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                إنشاء حساب
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
