import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Ticket, CircleDollarSign, BarChart3 } from "lucide-react";
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
    label: "New Users",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,234</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,432</div>
            <p className="text-xs text-muted-foreground">+12.1% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets (TK)</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,231,890</div>
            <p className="text-xs text-muted-foreground">In circulation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points (PT)</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,453,200</div>
            <p className="text-xs text-muted-foreground">In circulation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground"/>
                    New Users This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <ResponsiveContainer>
                      <BarChart data={chartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} />
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
                    Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary"/>
                        <div>
                            <p className="text-sm font-medium">New user 'Player123' registered.</p>
                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-amber-500"/>
                        <div>
                            <p className="text-sm font-medium">'WinnerGuy' won the daily raffle.</p>
                            <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-2 text-pink-500"/>
                        <div>
                            <p className="text-sm font-medium">'Spinner' won 100 TK on the Lucky Wheel.</p>
                            <p className="text-xs text-muted-foreground">3 hours ago</p>
                        </div>
                    </div>
                </div>
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
