import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Ticket, CircleDollarSign, BarChart3, Trophy, Gift } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const chartData = [
  { date: "2024-07-01", users: 20 },
  { date: "2024-07-02", users: 35 },
  { date: "2024-07-03", users: 50 },
  { date: "2024-07-04", users: 45 },
  { date: "2024-07-05", users: 60 },
  { date: "2024-07-06", users: 80 },
  { date: "2024-07-07", users: 95 },
];

const chartConfig = {
  users: {
    label: "مستخدمون جدد",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,234</div>
            <p className="text-xs text-muted-foreground">+5.2% عن الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون (24 ساعة)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,432</div>
            <p className="text-xs text-muted-foreground">+12.1% عن الأمس</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التذاكر (TK)</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,231,890</div>
            <p className="text-xs text-muted-foreground">قيد التداول</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي النقاط (PT)</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,453,200</div>
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
                <ChartContainer config={chartConfig} className="h-[250px] w-full" dir="ltr">
                  <ResponsiveContainer>
                      <BarChart data={chartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => new Date(value).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                      </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
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
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 ml-2 text-primary"/>
                        <div>
                            <p className="text-sm font-medium">مستخدم جديد 'Player123' سجل.</p>
                            <p className="text-xs text-muted-foreground">قبل دقيقتين</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <Trophy className="h-4 w-4 ml-2 text-amber-500"/>
                        <div>
                            <p className="text-sm font-medium">'WinnerGuy' فاز بالسحب اليومي.</p>
                            <p className="text-xs text-muted-foreground">قبل ساعة</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <Gift className="h-4 w-4 ml-2 text-pink-500"/>
                        <div>
                            <p className="text-sm font-medium">'Spinner' فاز بـ 100 تذكرة على عجلة الحظ.</p>
                            <p className="text-xs text-muted-foreground">قبل 3 ساعات</p>
                        </div>
                    </div>
                </div>
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
