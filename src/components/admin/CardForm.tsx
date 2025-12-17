'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from 'next/link';
import type { Card as CardType } from '@/lib/definitions';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Card' : 'Create Card')}
    </Button>
  );
}

type CardFormProps = {
    formAction: (payload: FormData) => void;
    initialData?: CardType;
}

export default function CardForm({ formAction, initialData }: CardFormProps) {
  const [state, action] = useFormState(formAction, undefined);
  const isEditing = !!initialData;

  return (
    <Card className="max-w-2xl">
      <form action={action}>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              name="question"
              placeholder="What is the main purpose of Next.js?"
              required
              defaultValue={initialData?.question}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              name="answer"
              placeholder="To enable React-based web applications with server-side rendering and generating static websites."
              required
              defaultValue={initialData?.answer}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup name="status" defaultValue={initialData?.status || 'inactive'} className="flex gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inactive" id="inactive" />
                <Label htmlFor="inactive">Inactive</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" asChild>
                <Link href="/admin">Cancel</Link>
            </Button>
            <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </form>
    </Card>
  );
}
