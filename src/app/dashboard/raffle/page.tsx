'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/countdown';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Ticket, Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { useState } from 'react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function RafflePage() {
    const prizeImage = PlaceHolderImages.find(p => p.id === 'raffle-prize');
    const { data: session } = useSession();
    const { toast } = useToast();
    const { data: activeRaffle, error, isLoading } = useSWR('/api/raffle/current', fetcher);
    
    const [isEntering, setIsEntering] = useState(false);

    const participants = activeRaffle?.participants ?? [];
    const hasUserEntered = session && participants.some((p: any) => p.playfabId === (session.user as any).id);
    
    const handleEnterRaffle = async () => {
         if (!session || !activeRaffle || hasUserEntered || isEntering) return;
         
         setIsEntering(true);
         try {
            await axios.post('/api/raffle/enter');
            toast({
                title: 'تم دخول السحب بنجاح!',
                description: `لقد دخلت السحب. حظا موفقا!`,
            });
            // Re-fetch the raffle data to update the participant list
            mutate('/api/raffle/current');
         } catch(err: any) {
            const errorMessage = err.response?.data?.error || 'حدث خطأ أثناء محاولة دخول السحب.';
            toast({
                variant: 'destructive',
                title: 'خطأ',
                description: errorMessage,
            });
         } finally {
            setIsEntering(false);
         }
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (error || !activeRaffle) {
        return (
             <div className="flex items-center justify-center h-96">
                <Card>
                    <CardHeader>
                        <CardTitle>لا يوجد سحب نشط</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>يرجى التحقق مرة أخرى لاحقًا لمعرفة السحب التالي!</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const raffleEndDate = new Date(activeRaffle.endDate);
    const ticketCost = activeRaffle.ticketCost || 1; // Default to 1 if not defined

    return (
        <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-3 flex flex-col gap-8">
                <Card className="bg-glass shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl md:text-4xl font-headline">السحب اليومي</CardTitle>
                        <CardDescription>ادخل لفرصة الفوز بالجائزة الكبرى!</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        {prizeImage && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                <Image
                                    src={prizeImage.imageUrl}
                                    alt="Raffle Prize"
                                    fill
                                    className="object-cover"
                                    data-ai-hint={prizeImage.imageHint}
                                />
                            </div>
                        )}
                        <div>
                            <p className="text-center text-muted-foreground">جائزة اليوم</p>
                            <p className="text-3xl font-bold font-headline text-gradient">{activeRaffle.prizeAmount.toLocaleString()} {activeRaffle.prizeType === 'Tickets' ? 'تذكرة' : 'نقطة'}</p>
                        </div>
                        <Countdown to={raffleEndDate} />
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button 
                            size="lg" 
                            className="w-full max-w-xs"
                            onClick={handleEnterRaffle}
                            disabled={hasUserEntered || isEntering || !session}
                        >
                            {isEntering 
                                ? <Loader className="h-5 w-5 animate-spin"/> 
                                : hasUserEntered 
                                    ? 'لقد دخلت بالفعل' 
                                    : `ادخل السحب (${ticketCost} تذاكر)`
                            }
                            {!isEntering && <Ticket className="mr-2 h-5 w-5" />}
                        </Button>
                        {hasUserEntered && <p className="text-xs text-muted-foreground">حظا موفقا!</p>}
                    </CardFooter>
                </Card>
            </div>
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            المشاركون ({participants?.length ?? 0})
                        </CardTitle>
                        <CardDescription>انظر من يشارك في السحب.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                             <div className="flex justify-center items-center h-40">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                             </div>
                        ) : (
                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                            {participants && participants.length > 0 ? participants.map((p: any) => (
                                <div key={p.playfabId} className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://picsum.photos/seed/${p.playfabId}/100/100`} />
                                        <AvatarFallback>{p.username?.substring(0,2) ?? '؟'}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-medium">{p.username}</p>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-8">كن أول من يدخل السحب!</p>
                            )}
                        </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
