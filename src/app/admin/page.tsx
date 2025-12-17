import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BookCopy,
  PlusCircle,
  Users,
  HelpCircle,
  UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewChart } from '@/components/admin/dashboard/OverviewChart';
import { RecentUsers } from '@/components/admin/dashboard/RecentUsers';
import { RecentQuestions } from '@/components/admin/dashboard/RecentQuestions';
import { LineChartComponent } from '@/components/admin/dashboard/LineChartComponent';

import { getAllCards } from '@/lib/actions/cardActions';
import { getAllUsers } from '@/lib/actions/userActions';

export default async function Dashboard() {
    const cardData = await getAllCards();
    const userData = await getAllUsers();

    const totalQuestions = cardData.length;
    const activeQuestions = cardData.filter(c => c.status === 'active').length;
    const totalUsers = userData.length;
    const questionsAdded = userData.reduce((acc, user) => acc + user.questionsAdded, 0);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Questions
              </CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                Total questions in the database
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Questions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeQuestions}</div>
              <p className="text-xs text-muted-foreground">
                Currently in play
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Total registered users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Added by Users</CardTitle>
              <BookCopy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questionsAdded}</div>
              <p className="text-xs text-muted-foreground">
                From all users
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" size="lg" className="h-20 flex-col gap-1">
                <Link href="/admin/cards/new">
                    <PlusCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">New Question</span>
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-20 flex-col gap-1">
                <Link href="/admin/manage-users">
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm font-medium">Add User</span>
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-20 flex-col gap-1">
                <Link href="/admin/manage-questions">
                    <HelpCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Manage Questions</span>
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-20 flex-col gap-1">
                <Link href="/admin/manage-users">
                    <Users className="h-6 w-6" />
                    <span className="text-sm font-medium">Manage Users</span>
                </Link>
            </Button>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Questions Activity</CardTitle>
              <CardDescription>
                A line chart showing questions added over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent />
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Users Overview</CardTitle>
                <CardDescription>
                  Recent new users in the last 7 days.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/admin/manage-users">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <OverviewChart />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <RecentQuestions questions={cardData} />
            <RecentUsers users={userData} />
        </div>
      </main>
    </div>
  );
}
