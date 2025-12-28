'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Ticket, CircleDollarSign, BarChart3 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import useSWR from 'swr';
import axios from 'axios';
import { Loader } from "lucide-react";

const chartConfig = {
  users: {
    label: "مستخدمون جدد",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function AdminDashboardPage() {
    const { data: stats, error, isLoading } = useSWR('/api/admin/stats', fetcher);
    
    const isStatsLoading = isLoading || !stats;

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isStatsLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats?.totalUsers}</div>}
             <p className="text-xs text-muted-foreground">إجمالي المستخدمين المسجلين</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats?.activeUsers}</div>}
            <p className="text-xs text-muted-foreground">آخر 30 يومًا</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التذاكر (TK)</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isStatsLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats?.totalTickets.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">قيد التداول</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي النقاط (PT)</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? <Loader className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats?.totalPoints.toLocaleString()}</div>}
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
                {isStatsLoading ? <div className="h-[250px] w-full flex items-center justify-center"><Loader className="h-8 w-8 animate-spin"/></div> : (
                <ChartContainer config={chartConfig} className="h-[250px] w-full" dir="ltr">
                  <ResponsiveContainer>
                      <BarChart data={stats?.newUsersByDay}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => new Date(value).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })} />
                          <YAxis allowDecimals={false}/>
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
                 {isStatsLoading ? <div className="h-40 flex items-center justify-center"><Loader className="h-8 w-8 animate-spin"/></div> : (
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
