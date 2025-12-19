
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAddBulkQuestionsMutation } from '@/utils/services/api';
import { useToast } from '@/hooks/use-toast';
import { Info, Loader2 } from 'lucide-react';

interface BulkQuestionFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BulkQuestionFormModal({ isOpen, onOpenChange }: BulkQuestionFormModalProps) {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [addBulkQuestions, { isLoading }] = useAddBulkQuestionsMutation();

  const handleSave = async () => {
    const lines = text.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter at least one question.',
      });
      return;
    }

    const questions = lines.map(line => {
      const parts = line.split(';');
      if (parts.length < 2) {
        return null;
      }
      return {
        question: parts[0].trim(),
        answer: parts.slice(1).join(';').trim(),
        status: 'inactive',
      };
    }).filter(q => q && q.question && q.answer);

    if (questions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Formatting Error',
        description: 'No valid questions found. Please check your formatting (Question;Answer).',
      });
      return;
    }

    try {
      const result = await addBulkQuestions({ questions }).unwrap();
      toast({
        title: 'Success!',
        description: result.message,
      });
      setText('');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.data?.error || 'Failed to add questions.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Questions in Bulk</DialogTitle>
          <DialogDescription>
            Paste your questions below. Each entry should be on a new line, with the question and answer separated by a semicolon (;).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Format Example</AlertTitle>
            <AlertDescription>
              What is the capital of Canada?;Ottawa<br />
              Which planet is known as the Red Planet?;Mars
            </AlertDescription>
          </Alert>
          <Textarea
            placeholder="Paste your questions here..."
            className="min-h-[200px] resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Saving...' : `Save ${text.trim().split('\n').filter(Boolean).length} Questions`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
