import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/countdown';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Ticket } from 'lucide-react';

const participants = [
    { id: 1, name: 'PlayerOne', avatarSeed: 'avatar1' },
    { id: 2, name: 'WinnerGal', avatarSeed: 'avatar2' },
    { id: 3, name: 'NoobMaster69', avatarSeed: 'avatar3' },
    { id: 4, name: 'LuckyLuke', avatarSeed: 'avatar4' },
    { id: 5, name: 'PlayerFive', avatarSeed: 'avatar5' },
];

export default function RafflePage() {
    const prizeImage = PlaceHolderImages.find(p => p.id === 'raffle-prize');
    const raffleEndDate = new Date();
    raffleEndDate.setHours(raffleEndDate.getHours() + 8);
    raffleEndDate.setMinutes(raffleEndDate.getMinutes() + 34);
    raffleEndDate.setSeconds(raffleEndDate.getSeconds() + 52);


    return (
        <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-3 flex flex-col gap-8">
                <Card className="bg-glass shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl md:text-4xl font-headline">Daily Raffle</CardTitle>
                        <CardDescription>Enter for a chance to win the grand prize!</CardDescription>
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
                            <p className="text-center text-muted-foreground">Today's Prize</p>
                            <p className="text-3xl font-bold font-headline text-gradient">10,000 Tickets</p>
                        </div>
                        <Countdown to={raffleEndDate} />
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button size="lg" className="w-full max-w-xs">
                            Enter Raffle (5 TK) <Ticket className="ml-2 h-5 w-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground">You have already entered today's raffle.</p>
                    </CardFooter>
                </Card>
            </div>
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Participants ({participants.length})
                        </CardTitle>
                        <CardDescription>See who's in the running.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                            {participants.map(p => (
                                <div key={p.id} className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://picsum.photos/seed/${p.avatarSeed}/100/100`} />
                                        <AvatarFallback>{p.name.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-medium">{p.name}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
