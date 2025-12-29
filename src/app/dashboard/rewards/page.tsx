
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Gift, Loader2, AlertCircle } from "lucide-react";
import useSWR from 'swr';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const REWARDS = [
    { day: 1, amount: 10 },
    { day: 2, amount: 20 },
    { day: 3, amount: 30 },
    { day: 4, amount: 40 },
    { day: 5, amount: 100 },
];

export default function DailyRewardsPage() {
    const { data: session } = useSession();
    const [isClaiming, setIsClaiming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { data: rewardState, isLoading, mutate } = useSWR(session ? '/api/rewards/state' : null, fetcher, { 
        revalidateOnFocus: false // Prevents re-fetching on focus, claim action will mutate
    });

    const handleClaimReward = async () => {
        setIsClaiming(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post('/api/rewards/claim');
            setSuccess(response.data.message);
            // Manually update the state to reflect the claim
            mutate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'حدث خطأ غير متوقع.');
        } finally {
            setIsClaiming(false);
        }
    };

    const getDayCard = (day: number, amount: number) => {
        if (isLoading || !rewardState) {
            return (
                <Card key={day} className="text-center bg-gray-100 dark:bg-gray-800 relative">
                    <CardHeader>
                        <CardTitle>اليوم {day}</CardTitle>
                        <CardDescription>{amount} تذكرة</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </CardContent>
                </Card>
            );
        }
        
        const currentStreak = rewardState.streak;
        const canClaimToday = rewardState.canClaim;

        const isClaimed = day <= currentStreak;
        const isToday = day === currentStreak + 1;
        const isFuture = day > currentStreak + 1;

        if (isClaimed) {
            return (
                <Card key={day} className="text-center bg-green-50 border-green-200 dark:bg-green-950 relative overflow-hidden">
                     <div className="absolute top-2 right-2 p-2 bg-green-500 text-white rounded-full">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-green-700 dark:text-green-300">اليوم {day}</CardTitle>
                        <CardDescription className="text-green-600 dark:text-green-400">تم الاستلام</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-300">{amount} تذكرة</p>
                    </CardContent>
                </Card>
            );
        }

        if (isToday) {
            return (
                <Card key={day} className="text-center border-2 border-primary dark:border-primary ring-4 ring-primary/20">
                    <CardHeader>
                        <CardTitle>اليوم {day}</CardTitle>
                         <CardDescription>{amount} تذكرة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={handleClaimReward} 
                            disabled={isClaiming || !canClaimToday}
                            className="w-full"
                        >
                            {isClaiming ? <Loader2 className="h-4 w-4 animate-spin" /> : "احصل على المكافأة"}
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        // isFuture
        return (
            <Card key={day} className="text-center bg-gray-100 dark:bg-gray-800 relative">
                 <div className="absolute top-2 right-2 p-2 bg-gray-400 text-white rounded-full">
                    <Lock className="h-6 w-6" />
                </div>
                <CardHeader>
                    <CardTitle className="text-muted-foreground">اليوم {day}</CardTitle>
                    <CardDescription className="text-muted-foreground">مغلق</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">{amount} تذكرة</p>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                        <Gift className="h-8 w-8 text-primary" />
                        المكافأة اليومية
                    </CardTitle>
                    <CardDescription>سجّل دخولك كل يوم للحصول على مكافآت متزايدة!</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>فشل!</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                     {success && (
                        <Alert variant="default" className="bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:text-green-200">
                            <AlertTitle>نجاح!</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                    {!isLoading && rewardState && !rewardState.canClaim && rewardState.streak < REWARDS.length && (
                         <Alert variant="default" className="border-orange-400 bg-orange-50 text-orange-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>ملاحظة هامة</AlertTitle>
                            <AlertDescription>
                                أنت غير نشط. يجب عليك لعب اللعبة أولاً لزيادة أو إنقاص رصيد تذاكرك قبل المطالبة بمكافأة اليوم.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                       {REWARDS.map(reward => getDayCard(reward.day, reward.amount))}
                    </div>
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        {rewardState && rewardState.streak >= REWARDS.length 
                            ? "لقد أكملت دورة المكافآت! تبدأ دورة جديدة غدًا."
                            : `لديك سلسلة متتالية من ${rewardState?.streak ?? 0} أيام. أكمل 5 أيام للحصول على الجائزة الكبرى!`
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
