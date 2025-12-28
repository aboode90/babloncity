'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Ticket, CircleDollarSign, BarChart3, Trophy, Gift, Loader } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useMemo } from "react";

const chartConfig = {
  users: {
    label: "مستخدمون جدد",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function AdminDashboardPage() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), orderBy('joinDate', 'desc'));
    }, [firestore]);

    const rafflesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'raffles'), orderBy('startDate', 'desc'), limit(1));
    }, [firestore]);

    const { data: users, isLoading: usersLoading } = useCollection(usersQuery);
    const { data: raffles, isLoading: rafflesLoading } = useCollection(rafflesQuery);
    const activeRaffle = raffles?.[0];

    const raffleEntriesQuery = useMemoFirebase(() => {
        if (!firestore || !activeRaffle) return null;
        return query(collection(firestore, `raffles/${activeRaffle.id}/raffleEntries`), orderBy('entryDate', 'desc'), limit(3));
    }, [firestore, activeRaffle]);

    const { data: recentEntries, isLoading: entriesLoading } = useCollection(raffleEntriesQuery);
    
    const stats = useMemo(() => {
        if (!users) return { totalUsers: 0, totalTickets: 0, totalPoints: 0, newUsersThisWeek: [] };

        const totalTickets = users.reduce((acc, user) => acc + (user.tickets || 0), 0);
        const totalPoints = users.reduce((acc, user) => acc + (user.points || 0), 0);

        const today = new Date();
        const pastWeek = new Array(7).fill(0).map((_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const newUsersByDay = pastWeek.map(dateStr => {
            const count = users.filter(user => user.joinDate?.startsWith(dateStr)).length;
            return { date: dateStr, users: count };
        });

        return {
            totalUsers: users.length,
            totalTickets,
            totalPoints,
            newUsersThisWeek: newUsersByDay
        };
    }, [users]);
    
    const isLoading = usersLoading || rafflesLoading || entriesLoading;

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {usersLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.totalUsers}</div>}
             <p className="text-xs text-muted-foreground">إجمالي المستخدمين المسجلين</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.totalUsers}</div>}
            <p className="text-xs text-muted-foreground">(قيد التطوير)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التذاكر (TK)</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {usersLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.totalTickets.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">قيد التداول</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي النقاط (PT)</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">قيد التداول</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground"/>
                    المستخدمون الجدد هذا الأسبوع
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? <div className="h-[250px] w-full flex items-center justify-center"><Loader className="h-8 w-8 animate-spin"/></div> : (
                <ChartContainer config={chartConfig} className="h-[250px] w-full" dir="ltr">
                  <ResponsiveContainer>
                      <BarChart data={stats.newUsersThisWeek}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => new Date(value).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                      </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                )}
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground"/>
                    النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                 {isLoading ? <div className="h-40 flex items-center justify-center"><Loader className="h-8 w-8 animate-spin"/></div> : (
                <div className="space-y-4">
                    {users?.slice(0, 1).map(user => (
                        <div key={user.id} className="flex items-center">
                            <Users className="h-4 w-4 ml-2 text-primary"/>
                            <div>
                                <p className="text-sm font-medium">مستخدم جديد '{user.username}' سجل.</p>
                                <p className="text-xs text-muted-foreground">{new Date(user.joinDate).toLocaleString('ar-EG')}</p>
                            </div>
                        </div>
                    ))}
                     {recentEntries?.slice(0, 2).map(entry => (
                         <div key={entry.id} className="flex items-center">
                            <Trophy className="h-4 w-4 ml-2 text-amber-500"/>
                            <div>
                                <p className="text-sm font-medium">'{entry.username}' دخل السحب اليومي.</p>
                                <p className="text-xs text-muted-foreground">{new Date(entry.entryDate).toLocaleString('ar-EG')}</p>
                            </div>
                        </div>
                     ))}
                </div>
                 )}
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
