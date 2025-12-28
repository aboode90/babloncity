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
import { MoreHorizontal, PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const users = [
    { id: 1, username: "PlayerOne", email: "player1@test.com", tickets: 1250, points: 5000, joinDate: "2023-10-21", lastLogin: "2024-07-21", status: "نشط" },
    { id: 2, username: "WinnerGal", email: "winner@test.com", tickets: 10500, points: 12000, joinDate: "2023-11-05", lastLogin: "2024-07-21", status: "نشط" },
    { id: 3, username: "NoobMaster69", email: "noob@test.com", tickets: 50, points: 100, joinDate: "2024-01-15", lastLogin: "2024-07-20", status: "نشط" },
    { id: 4, username: "InactiveUser", email: "inactive@test.com", tickets: 0, points: 0, joinDate: "2023-09-01", lastLogin: "2024-05-01", status: "غير نشط" },
    { id: 5, username: "BannedUser", email: "banned@test.com", tickets: 200, points: 1000, joinDate: "2024-03-01", lastLogin: "2024-06-15", status: "محظور" },
]

const statusMap = {
    "نشط": "Active",
    "غير نشط": "Inactive",
    "محظور": "Banned",
}

export default function AdminUsersPage() {
    return (
      <Tabs defaultValue="all">
        <div className="flex items-center">
            <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="inactive">غير نشط</TabsTrigger>
                <TabsTrigger value="banned" className="text-destructive">محظور</TabsTrigger>
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
                            {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-left">{user.tickets.toLocaleString()}</TableCell>
                                <TableCell className="text-left">{user.points.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === 'محظور' ? 'destructive' : 'outline'}>{user.status}</Badge>
                                </TableCell>
                                <TableCell>{user.lastLogin}</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    )
}
