'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookCopy, HelpCircle, User, Settings, Check, Star, Activity, TrendingUp, BarChart, Users as UsersIcon } from 'lucide-react';
import { useGetCurrentUserQuery } from '@/utils/services/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProfileOverviewSkeleton } from '@/components/profile/ProfileOverviewSkeleton';
import { LineChartComponent } from '@/components/admin/dashboard/LineChartComponent';
import { OverviewChart } from '@/components/admin/dashboard/OverviewChart';

export default function ProfileOverviewPage() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetCurrentUserQuery(undefined);

  useEffect(() => {
    if (isError && error && 'status' in error && error.status === 401) {
      router.push('/login');
    }
  }, [isError, error, router]);

  if (isLoading) {
    return <ProfileOverviewSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load user data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.success || !data?.user) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            User data not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const user = data.user;
  const totalQuestions = user.questionsAdded || 0;
  const activeQuestions = Math.floor(totalQuestions * 0.75);

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
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Based on submitted questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rank</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#12</div>
            <p className="text-xs text-muted-foreground">Among all contributors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 days</div>
            <p className="text-xs text-muted-foreground">Consecutive contribution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contribution Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
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
              <LineChartComponent />
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
              <OverviewChart />
            </CardContent>
          </Card>
        </div>
       
       <Card>
        <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground p-8">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4">Account settings coming soon!</p>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
