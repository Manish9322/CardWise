'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(login, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: state.error,
        });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="admin@cardwise.com" required defaultValue="admin@cardwise.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required defaultValue="Password@cardwise" />
          </div>
          <p className="text-xs text-muted-foreground">Hint: Use `admin@cardwise.com` and `Password@cardwise`.</p>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
