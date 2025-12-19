'use client';

import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Users, BookCopy, CheckCircle, XCircle, Terminal, RefreshCw, X } from 'lucide-react';
import { useGetQuestionsQuery } from '@/utils/services/api';
import { QuestionsTable } from '@/components/admin/questions-table/QuestionsTable';
import { ManageQuestionsSkeleton } from '@/components/admin/skeletons/ManageQuestionsSkeleton';

export default function ManageQuestionsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const username = searchParams.get('username');
  
  const { data: cards, error, isLoading, isFetching, refetch } = useGetQuestionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <ManageQuestionsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
            <Terminal className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold text-destructive">Error Fetching Data</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                There was a problem loading the questions. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
            </Button>
        </div>
      </div>
    );
  }
  
  if (!cards || cards.length === 0) {
    return (
       <div className="space-y-6">
        <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage Questions</h1>
                <p className="text-muted-foreground mt-1">Here you can add, edit, and manage all the questions in the game.</p>
              </div>
            </div>
        </div>
        <div className="text-center py-16 rounded-lg border-2 border-dashed">
            <BookCopy className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No Questions Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Get started by adding a new question.
            </p>
             <div className="mt-4">
                {/* This button is handled inside the QuestionsTable component */}
                <Button>Add New Question</Button>
            </div>
        </div>
      </div>
    );
  }

  const totalQuestions = cards.length;
  const activeQuestions = cards.filter((c: any) => c.status === 'active').length;
  const inactiveQuestions = cards.filter((c: any) => c.status === 'inactive').length;
  
  // Dummy data for users, as we don't have user data yet.
  const totalUsers = 1;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage Questions</h1>
                <p className="text-muted-foreground mt-1">Here you can add, edit, and manage all the questions in the game.</p>
            </div>
             <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}>
                {isFetching ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Refresh
            </Button>
          </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              All questions in the database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Questions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeQuestions}</div>
            <p className="text-xs text-muted-foreground">Currently in play</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Questions</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveQuestions}</div>
            <p className="text-xs text-muted-foreground">Not in play</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalUsers}</div>
             <p className="text-xs text-muted-foreground">Admin users</p>
          </CardContent>
        </Card>
      </div>
      
      <QuestionsTable 
        data={cards} 
        initialFilters={username ? [{ id: 'username', value: username }] : []} 
        filterUsername={username || undefined}
      />
    </div>
  );
}