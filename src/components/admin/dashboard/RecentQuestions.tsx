import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Card as CardType } from '@/lib/definitions';

export function RecentQuestions({ questions }: { questions: CardType[] }) {
  const recentQuestions = questions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Questions</CardTitle>
        <CardDescription>
          A list of the most recently added questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>
                  <div className="font-medium">{question.question}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {question.answer}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant={question.status === 'active' ? 'default' : 'secondary'}>
                    {question.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(question.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
