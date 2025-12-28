import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket, CircleDollarSign, Activity, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const recentActivities = [
    { type: 'wheel_spin', description: 'ربحت 50 تذكرة من عجلة الحظ', time: 'منذ ساعتين', icon: <Gift className="h-4 w-4 text-pink-500" /> },
    { type: 'raffle_entry', description: 'دخلت السحب اليومي', time: 'منذ يوم', icon: <Trophy className="h-4 w-4 text-amber-500" /> },
    { type: 'wheel_spin', description: 'ربحت 200 نقطة من عجلة الحظ', time: 'منذ يومين', icon: <Gift className="h-4 w-4 text-pink-500" /> },
    { type: 'login', description: 'تم تسجيل الدخول بنجاح', time: 'منذ يومين', icon: <Activity className="h-4 w-4 text-green-500" /> },
]

export default function DashboardPage() {
    return (
        <div className="grid gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">تذاكرك</CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">1,250 تذكرة</div>
                        <p className="text-xs text-muted-foreground">استخدمها لتدوير العجلة أو دخول السحوبات!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">نقاطك</CardTitle>
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">5,000 نقطة</div>
                        <p className="text-xs text-muted-foreground">تصدر لوحة المتصدرين واظهر نتيجتك.</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" /> النشاط الأخير
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>النشاط</TableHead>
                                    <TableHead className="text-left">الوقت</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentActivities.map((activity, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {activity.icon}
                                                <span className="font-medium">{activity.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-left text-muted-foreground">{activity.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>إجراءات سريعة</CardTitle>
                        <CardDescription>ماذا تود أن تفعل بعد ذلك؟</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Link href="/dashboard/lucky-wheel">
                            <Button className="w-full" size="lg">
                                <Gift className="ml-2 h-5 w-5" />
                                أدر عجلة الحظ
                            </Button>
                        </Link>
                        <Link href="/dashboard/raffle">
                            <Button className="w-full" size="lg" variant="secondary">
                                <Trophy className="ml-2 h-5 w-5" />
                                ادخل السحب اليومي
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
