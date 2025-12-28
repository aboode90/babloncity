'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Ticket, CircleDollarSign, BarChart3, Trophy, Gift, Loader } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useMemo } from "react";

const chartConfig = {
  users: {
    label: "مستخدمون جدد",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function AdminDashboardPage() {
    
    const stats = useMemo(() => {
        const totalUsers = 0;
        const totalTickets = 0;
        const totalPoints = 0;

        const today = new Date();
        const pastWeek = new Array(7).fill(0).map((_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const newUsersByDay = pastWeek.map(dateStr => {
            return { date: dateStr, users: 0 };
        });

        return {
            totalUsers,
            totalTickets,
            totalPoints,
            newUsersThisWeek: newUsersByDay
        };
    }, []);
    
    const isLoading = true;

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.totalUsers}</div>}
             <p className="text-xs text-muted-foreground">إجمالي المستخدمين المسجلين</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.totalUsers}</div>}
            <p className="text-xs text-muted-foreground">(قيد التطوير)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التذاكر (TK)</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.totalTickets.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">قيد التداول</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي النقاط (PT)</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>}
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
                {isLoading ? <div className="h-[250px] w-full flex items-center justify-center"><Loader className="h-8 w-8 animate-spin"/></div> : (
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
                  <p className="text-sm text-muted-foreground">قيد التطوير...</p>
                </div>
                 )}
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
