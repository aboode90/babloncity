import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket, CircleDollarSign, Activity, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const recentActivities = [
    { type: 'wheel_spin', description: 'Won 50 TK from Lucky Wheel', time: '2 hours ago', icon: <Gift className="h-4 w-4 text-pink-500" /> },
    { type: 'raffle_entry', description: 'Entered the Daily Raffle', time: '1 day ago', icon: <Trophy className="h-4 w-4 text-amber-500" /> },
    { type: 'wheel_spin', description: 'Won 200 PT from Lucky Wheel', time: '2 days ago', icon: <Gift className="h-4 w-4 text-pink-500" /> },
    { type: 'login', description: 'Logged in successfully', time: '2 days ago', icon: <Activity className="h-4 w-4 text-green-500" /> },
]

export default function DashboardPage() {
    return (
        <div className="grid gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Tickets</CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">1,250 TK</div>
                        <p className="text-xs text-muted-foreground">Use them to spin the wheel or enter raffles!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Points</CardTitle>
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">5,000 PT</div>
                        <p className="text-xs text-muted-foreground">Climb the leaderboards and show off your score.</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" /> Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Activity</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
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
                                        <TableCell className="text-right text-muted-foreground">{activity.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>What would you like to do next?</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Link href="/dashboard/lucky-wheel">
                            <Button className="w-full" size="lg">
                                <Gift className="mr-2 h-5 w-5" />
                                Spin the Lucky Wheel
                            </Button>
                        </Link>
                        <Link href="/dashboard/raffle">
                            <Button className="w-full" size="lg" variant="secondary">
                                <Trophy className="mr-2 h-5 w-5" />
                                Enter Daily Raffle
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
