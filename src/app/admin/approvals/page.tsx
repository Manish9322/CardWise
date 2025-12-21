'use client';

import { useMemo } from 'react';
import { useGetQuestionsQuery, useUpdateQuestionMutation } from '@/utils/services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookCopy, Terminal } from 'lucide-react';
import { ManageQuestionsSkeleton } from '@/components/admin/skeletons/ManageQuestionsSkeleton';

export default function ApprovalsPage() {
  const { data: questions, isLoading, error, refetch, isFetching } = useGetQuestionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const { toast } = useToast();

  const pendingQuestions = useMemo(() => {
    return questions ? questions.filter((q: any) => q.status === 'pending') : [];
  }, [questions]);

  const handleUpdateStatus = async (id: string, status: 'active' | 'inactive') => {
    const originalQuestion = questions.find((q: any) => q.id === id);
    if (!originalQuestion) return;

    try {
      await updateQuestion({ 
        id, 
        status, 
        question: originalQuestion.question, 
        answer: originalQuestion.answer 
      }).unwrap();
      toast({
        title: 'Success',
        description: `Question has been ${status === 'active' ? 'approved' : 'rejected'}.`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update question status.',
      });
    }
  };

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
            There was a problem loading pending questions. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and approve questions submitted by users.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}>
          {isFetching ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Questions</CardTitle>
          <CardDescription>
            {pendingQuestions.length} question(s) awaiting your review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingQuestions.length > 0 ? (
            <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingQuestions.map((q: any) => (
                  <TableRow key={q.id}>
                    <TableCell className="max-w-sm truncate">{q.question}</TableCell>
                    <TableCell className="max-w-xs truncate">{q.answer}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{q.username}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleUpdateStatus(q.id, 'active')}
                        disabled={isUpdating}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleUpdateStatus(q.id, 'inactive')}
                        disabled={isUpdating}
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-16">
              <div className="flex flex-col items-center gap-1 text-center">
                <BookCopy className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  All Caught Up!
                </h3>
                <p className="text-sm text-muted-foreground">
                  There are no pending questions to review.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
