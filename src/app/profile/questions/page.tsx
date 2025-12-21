
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookCopy, CheckCircle, XCircle, RefreshCw, Terminal } from 'lucide-react';
import { useGetUserQuestionsQuery } from '@/utils/services/api';
import { QuestionsTable } from '@/components/profile/questions-table/QuestionsTable';
import { ManageQuestionsSkeleton } from '@/components/admin/skeletons/ManageQuestionsSkeleton';
import { Button } from '@/components/ui/button';

export default function MyQuestionsPage() {
  const { data: cards, error, isLoading, isFetching, refetch } = useGetUserQuestionsQuery(undefined, {
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
                There was a problem loading your questions. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
            </Button>
        </div>
      </div>
    );
  }

  const cardData = cards || [];
  const totalQuestions = cardData.length;
  const activeQuestions = cardData.filter((c: any) => c.status === 'active').length;
  const inactiveQuestions = totalQuestions - activeQuestions;

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Questions</h1>
          <p className="text-muted-foreground mt-1">Here you can add, edit, and manage all of your questions.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}>
          {isFetching ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground">All questions you've added</p>
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
      </div>
      
      <QuestionsTable data={cardData} />
    </div>
  );
}
