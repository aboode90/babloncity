'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket, CircleDollarSign, Activity, Gift, Trophy, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc, limit, orderBy, query } from "firebase/firestore";

export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, `users/${user.uid}`);
    }, [user, firestore]);

    const transactionsQuery = useMemoFirebase(() => {
        if(!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/transactions`), orderBy('transactionDate', 'desc'), limit(5));
    }, [user, firestore]);

    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);
    const { data: transactions, isLoading: areTransactionsLoading } = useCollection(transactionsQuery);

    const getTransactionIcon = (description: string) => {
        if (description.includes('عجلة الحظ')) return <Gift className="h-4 w-4 text-pink-500" />;
        if (description.includes('السحب')) return <Trophy className="h-4 w-4 text-amber-500" />;
        if (description.includes('تسجيل')) return <Activity className="h-4 w-4 text-green-500" />;
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    };

    const formatTimeAgo = (isoDate: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return `منذ ${Math.floor(interval)} سنوات`;
        interval = seconds / 2592000;
        if (interval > 1) return `منذ ${Math.floor(interval)} أشهر`;
        interval = seconds / 86400;
        if (interval > 1) return `منذ ${Math.floor(interval)} أيام`;
        interval = seconds / 3600;
        if (interval > 1) return `منذ ${Math.floor(interval)} ساعات`;
        interval = seconds / 60;
        if (interval > 1) return `منذ ${Math.floor(interval)} دقائق`;
        return `منذ ${Math.floor(seconds)} ثواني`;
    }

    return (
        <div className="grid gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">تذاكرك</CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isUserLoading ? (
                            <Loader className="h-8 w-8 animate-spin" />
                        ) : (
                            <div className="text-4xl font-bold text-primary">{userData?.tickets?.toLocaleString() ?? 0} تذكرة</div>
                        )}
                        <p className="text-xs text-muted-foreground">استخدمها لتدوير العجلة أو دخول السحوبات!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">نقاطك</CardTitle>
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isUserLoading ? (
                           <Loader className="h-8 w-8 animate-spin" />
                        ) : (
                            <div className="text-4xl font-bold">{userData?.points?.toLocaleString() ?? 0} نقطة</div>
                        )}
                        <p className="text-xs text-muted-foreground">تصدر لوحة المتصدرين واظهر نتيجتك.</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" /> النشاط الأخير
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {areTransactionsLoading ? (
                             <div className="flex justify-center items-center h-40">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                             </div>
                        ) : (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>النشاط</TableHead>
                                    <TableHead className="text-left">الوقت</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions && transactions.length > 0 ? transactions.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getTransactionIcon(activity.description)}
                                                <span className="font-medium">{activity.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-left text-muted-foreground">{formatTimeAgo(activity.transactionDate)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center">لا يوجد نشاط لعرضه.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>إجراءات سريعة</CardTitle>
                        <CardDescription>ماذا تود أن تفعل بعد ذلك؟</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Link href="/dashboard/lucky-wheel">
                            <Button className="w-full" size="lg">
                                <Gift className="ml-2 h-5 w-5" />
                                أدر عجلة الحظ
                            </Button>
                        </Link>
                        <Link href="/dashboard/raffle">
                            <Button className="w-full" size="lg" variant="secondary">
                                <Trophy className="ml-2 h-5 w-5" />
                                ادخل السحب اليومي
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
