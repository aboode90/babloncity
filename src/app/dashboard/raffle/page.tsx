'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/countdown';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Ticket, Loader } from 'lucide-react';
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, limit, doc, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function RafflePage() {
    const prizeImage = PlaceHolderImages.find(p => p.id === 'raffle-prize');
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    // Query for the active raffle
    const activeRaffleQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'raffles'), where('status', '==', 'active'), limit(1));
    }, [firestore]);

    const { data: activeRaffles, isLoading: isRaffleLoading } = useCollection(activeRaffleQuery);
    const activeRaffle = activeRaffles?.[0];

    // Get user data
    const userDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, `users/${user.uid}`);
    }, [user, firestore]);
    const { data: userData } = useDoc(userDocRef);

    // Get participants for the active raffle
    const participantsQuery = useMemoFirebase(() => {
        if (!firestore || !activeRaffle) return null;
        return collection(firestore, `raffles/${activeRaffle.id}/raffleEntries`);
    }, [firestore, activeRaffle]);
    const { data: participants, isLoading: areParticipantsLoading } = useCollection(participantsQuery);

    // Check if the current user has already entered the raffle
    const userEntryQuery = useMemoFirebase(() => {
        if (!firestore || !activeRaffle || !user) return null;
        return query(collection(firestore, `raffles/${activeRaffle.id}/raffleEntries`), where('userId', '==', user.uid), limit(1));
    }, [firestore, activeRaffle, user]);
    const { data: userEntry, isLoading: isUserEntryLoading } = useCollection(userEntryQuery);
    const hasUserEntered = userEntry && userEntry.length > 0;

    const handleEnterRaffle = async () => {
        if (!user || !firestore || !activeRaffle || !userData || hasUserEntered) return;

        const cost = activeRaffle.ticketCost || 5;

        if (userData.tickets < cost) {
            toast({
                variant: 'destructive',
                title: 'رصيد غير كاف',
                description: `أنت بحاجة إلى ${cost} تذاكر على الأقل لدخول السحب.`,
            });
            return;
        }

        // Disable button to prevent multiple entries
        toast({ title: 'جاري تسجيل دخولك في السحب...' });

        try {
            // 1. Deduct tickets
            updateDocumentNonBlocking(userDocRef, { tickets: userData.tickets - cost });

            // 2. Log transaction for ticket deduction
            const transactionsColRef = collection(firestore, `users/${user.uid}/transactions`);
            addDocumentNonBlocking(transactionsColRef, {
                userId: user.uid,
                transactionDate: new Date().toISOString(),
                currencyType: 'Tickets',
                amount: -cost,
                description: `دخول السحب اليومي #${activeRaffle.id}`,
            });

            // 3. Add raffle entry
            const raffleEntriesColRef = collection(firestore, `raffles/${activeRaffle.id}/raffleEntries`);
            await addDocumentNonBlocking(raffleEntriesColRef, {
                userId: user.uid,
                raffleId: activeRaffle.id,
                entryDate: new Date().toISOString(),
                username: userData.username,
            });

            toast({
                title: 'تم بنجاح!',
                description: 'لقد دخلت السحب اليومي. حظا موفقا!',
            });

        } catch (error) {
            console.error("Error entering raffle: ", error);
            // Re-add tickets if entry failed
            updateDocumentNonBlocking(userDocRef, { tickets: userData.tickets });
            toast({
                variant: 'destructive',
                title: 'حدث خطأ ما',
                description: 'لم نتمكن من تسجيل دخولك في السحب. يرجى المحاولة مرة أخرى.',
            });
        }
    };
    
    const isLoading = isRaffleLoading || areParticipantsLoading || isUserEntryLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!activeRaffle) {
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
                            disabled={hasUserEntered || isLoading}
                        >
                            {hasUserEntered ? 'لقد دخلت بالفعل' : `ادخل السحب (${activeRaffle.ticketCost} تذاكر)`}
                            <Ticket className="mr-2 h-5 w-5" />
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
                        {areParticipantsLoading ? (
                             <div className="flex justify-center items-center h-40">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                             </div>
                        ) : (
                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                            {participants && participants.length > 0 ? participants.map(p => (
                                <div key={p.id} className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://picsum.photos/seed/${p.userId}/100/100`} />
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
