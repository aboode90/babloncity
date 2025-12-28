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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"

export default function AdminUsersPage() {
    const firestore = useFirestore();
    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'users');
    }, [firestore]);

    const { data: users, isLoading } = useCollection(usersQuery);

    const getUserStatus = (lastLogin: string) => {
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
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="inactive">غير نشط</TabsTrigger>
            </TabsList>
            <div className="mr-auto flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="بحث عن مستخدمين..." className="pr-8" />
                </div>
                <Button size="sm" className="gap-1">
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
                            ) : users && users.length > 0 ? (
                                users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="text-left">{user.tickets.toLocaleString()}</TableCell>
                                    <TableCell className="text-left">{user.points.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getUserStatus(user.lastLogin) === 'غير نشط' ? 'destructive' : 'outline'}>{getUserStatus(user.lastLogin)}</Badge>
                                    </TableCell>
                                    <TableCell>{new Date(user.lastLogin).toLocaleDateString('ar-EG')}</TableCell>
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
                                                <DropdownMenuItem>تعديل الأرصدة</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">حظر المستخدم</DropdownMenuItem>
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
