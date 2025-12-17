'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/definitions';

interface ViewUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User;
}

export function ViewUserModal({ isOpen, onOpenChange, user }: ViewUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Viewing user with ID: {user.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <h4 className="font-semibold">Username</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{user.username}</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{user.email}</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">Phone</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{user.phone}</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">Questions Added</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{user.questionsAdded}</p>
            </div>
            <div className="flex items-center gap-4">
                <h4 className="font-semibold">Status</h4>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-600' : ''}>
                    {user.status}
                </Badge>
            </div>
            <div className="flex items-center gap-4">
                <h4 className="font-semibold">Member Since</h4>
                <p className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
