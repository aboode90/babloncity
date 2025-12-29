
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket, Activity, Gift, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url, { 
    headers: { 'Cache-Control': 'no-cache' }
}).then(res => res.data);

export default function DashboardPage() {
    const { data: session, status } = useSession();
    
    const { data: userData, isLoading: isBalanceLoading } = useSWR(session ? '/api/user/account' : null, fetcher, { revalidateOnFocus: true, revalidateOnReconnect: true });
    const { data: transactions, isLoading: isTransactionsLoading } = useSWR(session ? '/api/user/transactions' : null, fetcher);
    
    const isLoading = status === 'loading' || isBalanceLoading || isTransactionsLoading;

    const getTransactionIcon = (description: string) => {
        if (description.includes('تسجيل')) return <Activity className="h-4 w-4 text-green-500" />;
        if (description.includes('مكافأة')) return <Gift className="h-4 w-4 text-amber-500" />;
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
            <div className="grid gap-4 md:grid-cols-1">
                <Card className="w-full md:w-3/4 lg:w-1/2 mx-auto">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">تذاكرك</CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Loader className="h-8 w-8 animate-spin" />
                        ) : (
                            <div className="text-4xl font-bold text-primary">{userData?.VirtualCurrency?.TK?.toLocaleString() ?? 0} تذكرة</div>
                        )}
                        <p className="text-xs text-muted-foreground">اربح المزيد من خلال إكمال المهام!</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" /> النشاط الأخير
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
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
                                {transactions && transactions.length > 0 ? transactions.map((activity: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getTransactionIcon(activity.Description)}
                                                <span className="font-medium">{activity.Description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-left text-muted-foreground">{formatTimeAgo(activity.Timestamp)}</TableCell>
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
            </div>
        </div>
    );
}
