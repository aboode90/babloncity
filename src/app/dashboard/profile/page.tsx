'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CircleUserRound, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const transactions = [
    { date: '2024-07-21', description: 'ربح 50 تذكرة من عجلة الحظ', amount: '+50 TK', type: 'Credit' },
    { date: '2024-07-21', description: 'تدوير عجلة الحظ', amount: '-1 TK', type: 'Debit' },
    { date: '2024-07-20', description: 'دخول السحب اليومي', amount: '-5 TK', type: 'Debit' },
    { date: '2024-07-19', description: 'مكافأة لعبة', amount: '+100 PT', type: 'Credit' },
];

export default function ProfilePage() {
    const avatar = PlaceHolderImages.find(p => p.id === 'avatar1');
    const { user } = useUser();
    const firestore = useFirestore();
    const [joinDate, setJoinDate] = useState('');


    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, `users/${user.uid}`);
    }, [firestore, user]);

    const { data: userData } = useDoc(userDocRef);

    useEffect(() => {
        if (userData?.joinDate) {
            const date = new Date(userData.joinDate);
            const formattedDate = date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            setJoinDate(formattedDate);
        }
    }, [userData?.joinDate]);

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
                            <CardTitle className="text-2xl font-headline">{userData?.username || '...'}</CardTitle>
                            <CardDescription>{userData?.email || '...'}</CardDescription>
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
                            <p className="text-2xl font-bold">{userData?.tickets ?? '0'}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">النقاط (PT)</p>
                            <p className="text-2xl font-bold">{userData?.points ?? '0'}</p>
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>التاريخ</TableHead>
                                <TableHead>الوصف</TableHead>
                                <TableHead className="text-left">المبلغ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                                    <TableCell className="font-medium">{tx.description}</TableCell>
                                    <TableCell className={`text-left font-semibold ${tx.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}>
                                        {tx.amount}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
