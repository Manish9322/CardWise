'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BookCopy,
  Users,
  HelpCircle,
  UserPlus,
  Terminal,
  RefreshCw,
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
import { useGetQuestionsQuery, useGetUsersQuery } from '@/utils/services/api';
import { ManageQuestionsSkeleton } from '@/components/admin/skeletons/ManageQuestionsSkeleton';

export default function Dashboard() {
  const { data: cardData, isLoading: isLoadingCards, error: cardsError, refetch: refetchCards } = useGetQuestionsQuery(undefined);
  const { data: userData, isLoading: isLoadingUsers, error: usersError, refetch: refetchUsers } = useGetUsersQuery(undefined);

  const refetchAll = () => {
    refetchCards();
    refetchUsers();
  }

  if (isLoadingCards || isLoadingUsers) {
    return <ManageQuestionsSkeleton />;
  }

  if (cardsError || usersError) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <Terminal className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-destructive">Error Fetching Dashboard Data</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There was a problem loading the dashboard statistics. Please try again.
          </p>
          <Button onClick={refetchAll} variant="outline" size="sm" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const cardList = cardData || [];
  const userList = userData || [];

  const totalQuestions = cardList.length;
  const activeQuestions = cardList.filter((c: any) => c.status === 'active').length;
  const totalUsers = userList.length;
  const questionsAdded = userList.reduce((acc: any, user: any) => acc + (user.questionsAdded || 0), 0);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4">
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">A quick overview of your application's stats.</p>
            </div>
            <Button onClick={refetchAll} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuestions}</div>
              <p className="text-xs text-muted-foreground">Total questions in the database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Questions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeQuestions}</div>
              <p className="text-xs text-muted-foreground">Currently in play</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Added by Users</CardTitle>
              <BookCopy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questionsAdded}</div>
              <p className="text-xs text-muted-foreground">From all users</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <CardDescription>A line chart showing questions added over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent />
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Users Overview</CardTitle>
                <CardDescription>Recent new users in the last 7 days.</CardDescription>
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
            <RecentQuestions questions={cardList} />
            <RecentUsers users={userList} />
        </div>
      </main>
    </div>
  );
}
