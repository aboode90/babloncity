'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CircleUserRound, Edit, Loader } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilePage() {
    const avatar = PlaceHolderImages.find(p => p.id === 'avatar1');
    const { data: session } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [joinDate, setJoinDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                try {
                    const balanceRes = await axios.get('/api/user/balance');
                    setUserData(balanceRes.data);

                    // Placeholder for user account info and transactions
                    // const userAccountInfo = await axios.get('/api/user/account');
                    // setJoinDate(new Date(userAccountInfo.data.Created).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
                    // const transactionsRes = await axios.get('/api/user/transactions');
                    // setTransactions(transactionsRes.data);

                } catch (error) {
                    console.error("Failed to fetch user data", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [session]);


    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        {avatar ? (
                            <Image
                                src={avatar.imageUrl}
                                alt="User Avatar"
                                data-ai-hint={avatar.imageHint}
                                width={100}
                                height={100}
                                className="rounded-full border-4 border-primary shadow-lg"
                            />
                        ) : (
                            <CircleUserRound className="h-24 w-24 text-muted-foreground" />
                        )}
                        <div className="flex-grow">
                            <CardTitle className="text-2xl font-headline">{session?.user?.name || '...'}</CardTitle>
                            <CardDescription>{session?.user?.email || '...'}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-2">
                                {joinDate ? `انضم في ${joinDate}`: '...'}
                            </p>
                        </div>
                        <Button variant="outline">
                            <Edit className="ml-2 h-4 w-4" /> تعديل الملف الشخصي
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <p className="text-sm text-muted-foreground">التذاكر (TK)</p>
                            <p className="text-2xl font-bold">{isLoading ? <Loader className="h-6 w-6 animate-spin" /> : userData?.tickets ?? '0'}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">النقاط (PT)</p>
                            <p className="text-2xl font-bold">{isLoading ? <Loader className="h-6 w-6 animate-spin" /> : userData?.points ?? '0'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>سجل المعاملات</CardTitle>
                    <CardDescription>نشاط حسابك الأخير.</CardDescription>
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
                                <TableHead>التاريخ</TableHead>
                                <TableHead>الوصف</TableHead>
                                <TableHead className="text-left">المبلغ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions && transactions.length > 0 ? transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(tx.transactionDate).toLocaleString('ar-EG', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                    </TableCell>
                                    <TableCell className="font-medium">{tx.description}</TableCell>
                                    <TableCell className={`text-left font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                       {tx.amount > 0 ? '+' : ''}
                                       {tx.amount} {tx.currencyType === 'Tickets' ? 'تذكرة' : 'نقطة'}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">لا توجد معاملات لعرضها.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
