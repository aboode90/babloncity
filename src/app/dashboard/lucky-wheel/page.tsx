import { LuckyWheel } from "@/components/lucky-wheel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Ticket } from "lucide-react";

const prizes = [
  "100 تذكرة", "50 نقطة", "5 تذاكر", "حاول مرة أخرى", "200 نقطة", "10 تذاكر", "50 تذكرة", "20 نقطة"
];

export default function LuckyWheelPage() {
    return (
        <div className="container mx-auto py-8">
            <Card className="bg-glass shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl md:text-4xl font-headline">عجلة الحظ</CardTitle>
                    <CardDescription>اختبر حظك! كل دورة تكلف تذكرة واحدة.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8">
                    <LuckyWheel />
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
