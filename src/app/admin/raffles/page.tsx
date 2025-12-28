'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Loader } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Countdown } from "@/components/countdown";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import useSWR, { mutate } from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function AdminRafflesPage() {
    const { toast } = useToast();
    const [isEndingRaffle, setIsEndingRaffle] = useState(false);

    const { data: activeRaffle, isLoading: isRaffleLoading } = useSWR('/api/raffle/current', fetcher);
    const participants = activeRaffle?.participants ?? [];
    const areParticipantsLoading = isRaffleLoading;

    const handleEndRaffle = async () => {
        if (!activeRaffle || !participants || participants.length === 0) {
            toast({
                variant: "destructive",
                title: "لا يمكن إنهاء السحب",
                description: "لا يوجد مشاركون في السحب الحالي لإنهاءه.",
            });
            return;
        }

        setIsEndingRaffle(true);
        toast({ title: "جاري إنهاء السحب واختيار الفائز..." });

        try {
            const response = await axios.post('/api/admin/raffles/end');
            const { winner, prizeAmount } = response.data;
            toast({
                title: "تم إنهاء السحب بنجاح!",
                description: `الفائز هو ${winner.username}. لقد ربح ${prizeAmount} تذكرة.`,
            });
             mutate('/api/raffle/current'); // Re-fetch raffle data
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "لم نتمكن من إنهاء السحب. يرجى المحاولة مرة أخرى.";
             toast({
                variant: "destructive",
                title: "حدث خطأ",
                description: errorMessage
            });
        } finally {
             setIsEndingRaffle(false);
        }
    };

    const isLoading = isRaffleLoading;

    if (isLoading && !activeRaffle) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!activeRaffle || activeRaffle.winner) {
        return (
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <Card>
                    <CardHeader>
                         {activeRaffle?.winner ? (
                             <>
                                 <CardTitle>السحب الأخير قد انتهى</CardTitle>
                                 <CardDescription>الفائز كان {activeRaffle.winner.username}.</CardDescription>
                             </>
                         ) : (
                             <>
                                <CardTitle>لا يوجد سحب نشط حاليًا</CardTitle>
                                <CardDescription>يمكنك بدء سحب جديد من هنا.</CardDescription>
                            </>
                         )}
                    </CardHeader>
                    <CardContent>
                        <Button disabled>بدء سحب جديد (قيد التطوير)</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const raffleEndDate = new Date(activeRaffle.endDate);

    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <div>
                            <CardTitle>السحب اليومي الحالي</CardTitle>
                            <CardDescription>السحب رقم {activeRaffle.id.slice(0, 5)} - ينتهي في:</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" disabled>بدء سحب جديد</Button>
                            <Button variant="destructive" onClick={handleEndRaffle} disabled={isEndingRaffle || (participants && participants.length === 0)}>
                                {isEndingRaffle ? <Loader className="h-4 w-4 animate-spin"/> : 'إنهاء السحب الآن'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">الجائزة</p>
                            <p className="text-lg font-semibold">{activeRaffle.prizeAmount.toLocaleString()} {activeRaffle.prizeType === 'Tickets' ? 'تذكرة' : 'نقطة'}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">الوقت المتبقي</p>
                            <Countdown to={raffleEndDate} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-muted-foreground">المشاركات</p>
                            <p className="text-lg font-semibold text-left">{participants?.length ?? 0}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">المشاركون</h3>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>اسم المستخدم</TableHead>
                                        <TableHead>وقت الدخول</TableHead>
                                        <TableHead><span className="sr-only">الإجراءات</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {areParticipantsLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24"><Loader className="h-6 w-6 animate-spin mx-auto"/></TableCell>
                                        </TableRow>
                                    ) : participants && participants.length > 0 ? (
                                        participants.map((p: any) => (
                                            <TableRow key={p.playfabId}>
                                                <TableCell className="font-medium">{p.username}</TableCell>
                                                <TableCell>{new Date(p.timestamp).toLocaleString('ar-EG')}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">تبديل القائمة</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                                            <DropdownMenuItem disabled>عرض الملف الشخصي</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive" disabled>إزالة المشاركة</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                             <TableCell colSpan={3} className="text-center h-24">لم يشارك أحد بعد.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
