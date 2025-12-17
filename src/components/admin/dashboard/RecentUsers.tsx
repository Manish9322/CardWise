import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { User } from '@/lib/definitions';

export function RecentUsers({ users }: { users: User[] }) {
  const recentUsers = users.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>
          New users who recently joined.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={`/avatars/${user.username}.png`} alt="Avatar" />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="ml-auto font-medium">+{user.questionsAdded} Qs</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
