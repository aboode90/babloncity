import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CircleUserRound, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const transactions = [
    { date: '2024-07-21', description: 'Won 50 TK from Lucky Wheel', amount: '+50 TK', type: 'Credit' },
    { date: '2024-07-21', description: 'Spin Lucky Wheel', amount: '-1 TK', type: 'Debit' },
    { date: '2024-07-20', description: 'Entered Daily Raffle', amount: '-5 TK', type: 'Debit' },
    { date: '2024-07-19', description: 'Game Reward', amount: '+100 PT', type: 'Credit' },
];

export default function ProfilePage() {
    const avatar = PlaceHolderImages.find(p => p.id === 'avatar1');

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
                            <CardTitle className="text-2xl font-headline">PlayerOne</CardTitle>
                            <CardDescription>player1@test.com</CardDescription>
                            <p className="text-sm text-muted-foreground mt-2">Joined October 21, 2023</p>
                        </div>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <p className="text-sm text-muted-foreground">Tickets (TK)</p>
                            <p className="text-2xl font-bold">1,250</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Points (PT)</p>
                            <p className="text-2xl font-bold">5,000</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent account activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                                    <TableCell className="font-medium">{tx.description}</TableCell>
                                    <TableCell className={`text-right font-semibold ${tx.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}>
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
