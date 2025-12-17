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
import type { Card } from '@/lib/definitions';

interface ViewQuestionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  question: Card;
}

export function ViewQuestionModal({ isOpen, onOpenChange, question }: ViewQuestionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Question Details</DialogTitle>
          <DialogDescription>
            Viewing question with ID: {question.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <h4 className="font-semibold">Question</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{question.question}</p>
            </div>
            <div className="space-y-2">
                <h4 className="font-semibold">Answer</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{question.answer}</p>
            </div>
            <div className="flex items-center gap-4">
                <h4 className="font-semibold">Status</h4>
                <Badge variant={question.status === 'active' ? 'default' : 'secondary'} className={question.status === 'active' ? 'bg-green-600' : ''}>
                    {question.status}
                </Badge>
            </div>
            <div className="flex items-center gap-4">
                <h4 className="font-semibold">Created At</h4>
                <p className="text-sm text-muted-foreground">{new Date(question.createdAt).toLocaleString()}</p>
            </div>
             <div className="flex items-center gap-4">
                <h4 className="font-semibold">Added By</h4>
                <p className="text-sm text-muted-foreground">Admin</p>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
