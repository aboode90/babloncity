'use client';

import { LuckyWheel } from "@/components/lucky-wheel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Loader } from "lucide-react";

const prizes = [
  "100 تذكرة", "50 نقطة", "5 تذاكر", "حاول مرة أخرى", "200 نقطة", "10 تذاكر", "50 تذكرة", "20 نقطة"
];

export default function LuckyWheelPage() {

    // TODO: Re-implement logic to fetch user data
    const isUserLoading = true;
    const user = null;
    const userData = null;

    return (
        <div className="container mx-auto py-8">
            <Card className="bg-glass shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl md:text-4xl font-headline">عجلة الحظ</CardTitle>
                    <CardDescription>اختبر حظك! كل دورة تكلف تذكرة واحدة.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8">
                    {isUserLoading ? (
                        <div className="flex justify-center items-center h-[300px] md:h-[450px]">
                            <Loader className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <LuckyWheel user={user} userData={userData} />
                    )}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                            <Gift className="h-5 w-5 text-primary" />
                            الجوائز الممكنة
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2">
                            {prizes.join(' • ')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
