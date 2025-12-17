import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { getAllCards } from '@/lib/actions/cardActions';
import { QuestionsTable } from '@/components/admin/questions-table/QuestionsTable';

export default async function ManageQuestionsPage() {
  const cards = await getAllCards();

  const totalQuestions = cards.length;
  const activeQuestions = cards.filter(c => c.status === 'active').length;
  const inactiveQuestions = cards.filter(c => c.status === 'inactive').length;
  
  // Dummy data for users, as we don't have user data yet.
  const totalUsers = 1;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Questions</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground">All questions in the database</p>
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
      
      <QuestionsTable data={cards} />
    </div>
  );
}
