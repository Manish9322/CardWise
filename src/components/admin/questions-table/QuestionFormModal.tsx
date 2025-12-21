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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Card } from '@/lib/definitions';
import { useAddQuestionMutation, useUpdateQuestionMutation } from '@/utils/services/api';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface QuestionFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  question: Card | null;
}

const formSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  status: z.enum(['active', 'inactive', 'pending']),
});

type FormData = z.infer<typeof formSchema>;

export function QuestionFormModal({ isOpen, onOpenChange, question }: QuestionFormModalProps) {
  const { toast } = useToast();
  const isEditing = !!question;
  const [addQuestion] = useAddQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answer: '',
      status: 'pending',
    },
  });
  
  React.useEffect(() => {
    if (question) {
        form.reset({
            question: question.question,
            answer: question.answer,
            status: question.status,
        });
    } else {
        form.reset({
            question: '',
            answer: '',
            status: 'pending'
        });
    }
  }, [question, form, isOpen]);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
        if (isEditing && question) {
            await updateQuestion({
              id: question.id,
              question: data.question,
              answer: data.answer,
              status: data.status,
            }).unwrap();
            toast({ title: "Success", description: "Question updated successfully." });
        } else {
            await addQuestion({
              question: data.question,
              answer: data.answer,
              status: data.status,
            }).unwrap();
            toast({ title: "Success", description: "Question submitted for approval." });
        }
        onOpenChange(false);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to ${isEditing ? 'update' : 'create'} question.`
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of the question.' : 'Fill out the form to create a new question.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is the capital of France?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="active" />
                        </FormControl>
                        <FormLabel className="font-normal">Active</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="inactive" />
                        </FormControl>
                        <FormLabel className="font-normal">Inactive</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pending" />
                        </FormControl>
                        <FormLabel className="font-normal">Pending</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Question'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
