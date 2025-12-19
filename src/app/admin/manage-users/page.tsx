'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, HelpCircle, Terminal, RefreshCw, UserPlus } from 'lucide-react';
import { useGetUsersQuery } from '@/utils/services/api';
import { UsersTable } from '@/components/admin/users-table/UsersTable';
import { ManageUsersSkeleton } from '@/components/admin/skeletons/ManageUsersSkeleton';

export default function ManageUsersPage() {
  const { data: users, error, isLoading, isFetching, refetch } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <ManageUsersSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
            <Terminal className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold text-destructive">Error Fetching Data</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                There was a problem loading the users. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
            </Button>
        </div>
      </div>
    );
  }
  
  if (!users || users.length === 0) {
    return (
       <div className="space-y-6">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
            <p className="text-muted-foreground mt-1">View and manage all registered users in your application.</p>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-16">
          <div className="flex flex-col items-center gap-1 text-center">
             <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              No Users Found
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start by creating a new user.
            </p>
            <div className="mt-6">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const totalUsers = users.length;
  const activeUsers = users.filter((u: any) => u.status === 'active').length;
  const inactiveUsers = users.filter((u: any) => u.status === 'inactive').length;
  const totalQuestionsAdded = users.reduce((acc : number, user : any) => acc + (user.questionsAdded || 0), 0);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
            <p className="text-muted-foreground mt-1">View and manage all registered users in your application.</p>
        </div>
         <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}>
            {isFetching ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Users with active accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">Users with disabled accounts</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Added</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestionsAdded}</div>
             <p className="text-xs text-muted-foreground">Total questions by all users</p>
          </CardContent>
        </Card>
      </div>
      
      <UsersTable data={users} />
    </div>
  );
}
