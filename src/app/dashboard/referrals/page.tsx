'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Loader, Users, Ticket, Calendar, BarChart } from 'lucide-react';
import useSWR from 'swr';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ReferralsPage() {
    const { data, error, isLoading } = useSWR('/api/user/referral-stats', fetcher);
    const { toast } = useToast();

    const handleCopy = () => {
        if (data?.referralCode) {
            navigator.clipboard.writeText(data.referralCode);
            toast({ title: "تم نسخ رمز الإحالة!" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">حدث خطأ أثناء تحميل بيانات الإحالة.</p>;
    }

    return (
        <div className="grid gap-8">
            <Card className="bg-gradient-to-r from-primary/80 to-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle className="text-2xl">رمز الإحالة الخاص بك</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                        شارك هذا الرمز مع أصدقائك لكسب مكافآت عندما يلعبون.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <p className="text-4xl font-bold tracking-widest font-mono bg-primary-foreground/20 px-4 py-2 rounded-lg">
                        {data?.referralCode || '...'}
                    </p>
                    <Button variant="secondary" size="icon" onClick={handleCopy} aria-label="نسخ الرمز">
                        <Copy className="h-6 w-6" />
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي المحالين</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalReferrals?.toLocaleString() ?? '0'}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">أرباح اليوم</CardTitle>
                        <Ticket className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.earnings?.today?.toLocaleString() ?? '0'}</div>
                        <p className="text-xs text-muted-foreground">تذكرة</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">أرباح هذا الأسبوع</CardTitle>
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.earnings?.thisWeek?.toLocaleString() ?? '0'}</div>
                         <p className="text-xs text-muted-foreground">تذكرة</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي الأرباح</CardTitle>
                        <BarChart className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.earnings?.allTime?.toLocaleString() ?? '0'}</div>
                         <p className="text-xs text-muted-foreground">تذكرة</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>قائمة المستخدمين المحالين</CardTitle>
                    <CardDescription>المستخدمون الذين انضموا باستخدام الرمز الخاص بك.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>اسم المستخدم</TableHead>
                                <TableHead>تاريخ الانضمام</TableHead>
                                <TableHead className="text-right">الأرباح الناتجة</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.referredUsers && data.referredUsers.length > 0 ? (
                                data.referredUsers.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{new Date(user.joinDate).toLocaleDateString('ar-EG')}</TableCell>
                                    <TableCell className="text-right font-medium">{user.earningsGenerated.toLocaleString()} تذكرة</TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        لم تقم بإحالة أي مستخدمين حتى الآن. شارك رمزك!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
