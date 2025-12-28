'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle, Search, Loader } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function AdminUsersPage() {
    
    const { data: users, error, isLoading } = useSWR('/api/admin/users', fetcher);

    const getUserStatus = (lastLogin: string) => {
        if(!lastLogin) return 'غير نشط';
        const lastLoginDate = new Date(lastLogin);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastLoginDate > thirtyDaysAgo ? 'نشط' : 'غير نشط';
    }

    return (
      <Tabs defaultValue="all">
        <div className="flex items-center">
            <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active" disabled>نشط</TabsTrigger>
                <TabsTrigger value="inactive" disabled>غير نشط</TabsTrigger>
            </TabsList>
            <div className="mr-auto flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="بحث عن مستخدمين..." className="pr-8" disabled />
                </div>
                <Button size="sm" className="gap-1" disabled>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">إضافة مستخدم</span>
                </Button>
            </div>
        </div>
        <TabsContent value="all">
            <Card>
                <CardHeader>
                    <CardTitle>المستخدمون</CardTitle>
                    <CardDescription>إدارة مستخدمي اللعبة وتفاصيلهم.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>اسم المستخدم</TableHead>
                                <TableHead>البريد الإلكتروني</TableHead>
                                <TableHead className="text-left">التذاكر</TableHead>
                                <TableHead className="text-left">النقاط</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead>آخر تسجيل دخول</TableHead>
                                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-48">
                                        <Loader className="h-8 w-8 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : error || !users ? (
                                <TableRow>
                                     <TableCell colSpan={7} className="text-center h-48">
                                        حدث خطأ أثناء جلب المستخدمين.
                                    </TableCell>
                                </TableRow>
                            ) : users.length > 0 ? (
                                users.map((user: any) => (
                                <TableRow key={user.PlayFabId}>
                                    <TableCell className="font-medium">{user.DisplayName || 'N/A'}</TableCell>
                                    <TableCell>{user.Email || 'N/A'}</TableCell>
                                    <TableCell className="text-left">{user.VirtualCurrency?.TK?.toLocaleString() || 0}</TableCell>
                                    <TableCell className="text-left">{user.VirtualCurrency?.PT?.toLocaleString() || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant={getUserStatus(user.LastLogin) === 'غير نشط' ? 'destructive' : 'outline'}>{getUserStatus(user.LastLogin)}</Badge>
                                    </TableCell>
                                    <TableCell>{user.LastLogin ? new Date(user.LastLogin).toLocaleDateString('ar-EG') : 'N/A'}</TableCell>
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
                                                <DropdownMenuItem disabled>تعديل الأرصدة</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" disabled>حظر المستخدم</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-48">
                                        لا يوجد مستخدمون لعرضهم.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    )
}
