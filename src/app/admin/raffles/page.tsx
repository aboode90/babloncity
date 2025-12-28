import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Countdown } from "@/components/countdown";

const participants = [
    { id: 'usr_1', username: 'PlayerOne', entryTime: '2024-07-21T10:00:00Z' },
    { id: 'usr_2', username: 'WinnerGal', entryTime: '2024-07-21T10:05:00Z' },
    { id: 'usr_3', username: 'NoobMaster69', entryTime: '2024-07-21T10:15:00Z' },
    { id: 'usr_4', username: 'LuckyLuke', entryTime: '2024-07-21T11:30:00Z' },
];

export default function AdminRafflesPage() {
    const raffleEndDate = new Date();
    raffleEndDate.setHours(raffleEndDate.getHours() + 8);

    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <div>
                            <CardTitle>السحب اليومي الحالي</CardTitle>
                            <CardDescription>السحب رقم 23 - ينتهي في:</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">بدء سحب جديد</Button>
                            <Button variant="destructive">إنهاء السحب الآن</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">الجائزة</p>
                            <p className="text-lg font-semibold">10,000 تذكرة</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">الوقت المتبقي</p>
                            <Countdown to={raffleEndDate} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-muted-foreground">المشاركات</p>
                            <p className="text-lg font-semibold text-left">{participants.length}</p>
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
                                    {participants.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{p.username}</TableCell>
                                            <TableCell>{new Date(p.entryTime).toLocaleString('ar-EG')}</TableCell>
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
                                                        <DropdownMenuItem>عرض الملف الشخصي</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">إزالة المشاركة</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
