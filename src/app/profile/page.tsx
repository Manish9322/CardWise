
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookCopy, HelpCircle, User, Settings, Check, Star, Activity, TrendingUp, Terminal, RefreshCw } from 'lucide-react';
import { useGetCurrentUserQuery, useGetUserQuestionsQuery, useGetUsersQuery } from '@/utils/services/api';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { ProfileOverviewSkeleton } from '@/components/profile/ProfileOverviewSkeleton';
import { LineChartComponent, type LineChartData } from '@/components/admin/dashboard/LineChartComponent';
import { OverviewChart, type OverviewData } from '@/components/admin/dashboard/OverviewChart';
import { Button } from '@/components/ui/button';
import { format, getMonth } from 'date-fns';

export default function ProfileOverviewPage() {
  const router = useRouter();
  const { data: userData, isLoading: isLoadingUser, isError: isUserError, error: userError, refetch: refetchUser } = useGetCurrentUserQuery(undefined);
  const { data: userQuestions, isLoading: isLoadingQuestions, refetch: refetchUserQuestions } = useGetUserQuestionsQuery(undefined);
  const { data: allUsers, isLoading: isLoadingAllUsers, refetch: refetchAllUsers } = useGetUsersQuery(undefined);

  const refetchAll = () => {
    refetchUser();
    refetchUserQuestions();
    refetchAllUsers();
  };

  const isLoading = isLoadingUser || isLoadingQuestions || isLoadingAllUsers;

  const contributionData: LineChartData = useMemo(() => {
    const monthlyContributions = Array(12).fill(0);
    if (userQuestions) {
      userQuestions.forEach((q: any) => {
        const month = getMonth(new Date(q.createdAt));
        monthlyContributions[month]++;
      });
    }
    return [
      { name: "Jan", questions: monthlyContributions[0] },
      { name: "Feb", questions: monthlyContributions[1] },
      { name: "Mar", questions: monthlyContributions[2] },
      { name: "Apr", questions: monthlyContributions[3] },
      { name: "May", questions: monthlyContributions[4] },
      { name: "Jun", questions: monthlyContributions[5] },
      { name: "Jul", questions: monthlyContributions[6] },
      { name: "Aug", questions: monthlyContributions[7] },
      { name: "Sep", questions: monthlyContributions[8] },
      { name: "Oct", questions: monthlyContributions[9] },
      { name: "Nov", questions: monthlyContributions[10] },
      { name: "Dec", questions: monthlyContributions[11] },
    ];
  }, [userQuestions]);

  const leaderboardData: OverviewData = useMemo(() => {
    if (!allUsers) return [];
    return allUsers
      .map((u: any) => ({
        name: u.username,
        total: u.questionsAdded || 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7); // Show top 7 contributors
  }, [allUsers]);

  if (isLoading) {
    return <ProfileOverviewSkeleton />;
  }

  if (isUserError) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <Terminal className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-primary">Error Loading Your Profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There was a problem loading your user data. Please try again.
          </p>
          <Button onClick={refetchAll} variant="outline" size="sm" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!userData?.success || !userData?.user) {
    return (
       <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">User Not Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                We couldn't find your user data. Please try logging in again.
            </p>
            <Button onClick={() => router.push('/login')} variant="outline" size="sm" className="mt-4">
                Go to Login
            </Button>
        </div>
      </div>
    );
  }

  const user = userData.user;
  const totalQuestions = user.questionsAdded || 0;
  const activeQuestions = user.activeQuestions || 0;
  const approvalRate = totalQuestions > 0 ? ((activeQuestions / totalQuestions) * 100).toFixed(0) : 0;
  // Static data for now as these are more complex to calculate
  const rank = 12;
  const streak = 5;
  const contributionScore = totalQuestions * 10 + activeQuestions * 5;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.username}!</h1>
        <p className="text-muted-foreground mt-1">Here's a quick look at your activity.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Username</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.username}</div>
            <p className="text-xs text-muted-foreground">This is your public display name.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions Added</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Total questions you've contributed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeQuestions}</div>
            <p className="text-xs text-muted-foreground">Your questions currently in the game.</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground">Based on submitted questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rank</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{rank}</div>
            <p className="text-xs text-muted-foreground">Among all contributors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground">Consecutive contribution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contribution Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contributionScore}</div>
            <p className="text-xs text-muted-foreground">Your overall impact</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Contribution</CardTitle>
              <CardDescription>
                Questions added by you over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent data={contributionData} />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Contribution Leaderboard</CardTitle>
              <CardDescription>
                Your score compared to others.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OverviewChart data={leaderboardData} />
            </CardContent>
          </Card>
        </div>
       
       <Card>
        <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="text-center p-8">
                <Button onClick={() => router.push('/profile/settings')}>Go to Settings</Button>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
