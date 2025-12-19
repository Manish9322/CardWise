'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/lib/actions/authActions';
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
import type { User } from '@/lib/definitions';
import {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/utils/services/api';
import { useRouter } from 'next/navigation';
import { ProfileOverviewSkeleton } from '@/components/profile/ProfileOverviewSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const accountFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type AccountFormData = z.infer<typeof accountFormSchema>;

function AccountSettingsTab({ user }: { user: User }) {
  const { toast } = useToast();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
  });

  useEffect(() => {
    form.reset(user);
  }, [user, form]);

  const onSubmit: SubmitHandler<AccountFormData> = async (data) => {
    try {
      await updateUser({ id: user.id, ...data }).unwrap();
      toast({ title: 'Success', description: 'Your account has been updated.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.data?.error || 'Failed to update account.',
      });
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordFormSchema>;

function PasswordSettingsTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    setIsLoading(true);
    // This is a placeholder for password change logic.
    // In a real app, you would have an API endpoint for this.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Password change data:', data);
    toast({
      title: 'Password Updated',
      description: 'Your password has been changed (simulated).',
    });
    form.reset();
    setIsLoading(false);
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              For your security, we recommend choosing a strong password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function PreferencesSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Manage your notification and theme settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h4 className="font-medium">Marketing Emails</h4>
            <p className="text-sm text-muted-foreground">Receive emails about new products and features.</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h4 className="font-medium">Dark Mode</h4>
            <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
          </div>
          <Switch />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}

function DangerZoneTab({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(userId).unwrap();
      toast({
        title: 'Account Deletion Successful',
        description: 'Your account has been permanently deleted. You will be logged out.',
        variant: 'destructive',
      });
      setTimeout(() => logout(), 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete account.',
      });
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Card className="border-primary dark:border-purple-400">
        <CardHeader>
          <CardTitle className="text-primary dark:text-purple-500">Danger Zone</CardTitle>
          <CardDescription>
            These actions are irreversible. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h4 className="font-medium">Log Out</h4>
              <p className="text-sm text-muted-foreground">
                End your current session on this device.
              </p>
            </div>
            <Button variant="outline" onClick={() => logout()}>
              Log Out
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-purple-500/50 bg-purple-500/5 p-4">
            <div>
              <h4 className="font-medium text-primary dark:text-purple-500">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button variant="default" onClick={() => setShowDeleteModal(true)} className="bg-primary hover:bg-primary/90">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Yes, delete my account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetCurrentUserQuery(undefined);

  useEffect(() => {
    if (isError && error && 'status' in error && error.status === 401) {
      router.push('/login');
    }
  }, [isError, error, router]);

  if (isLoading) {
    return <ProfileOverviewSkeleton />;
  }

  if (isError || !data?.success || !data?.user) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            {isError ? 'Failed to load user data.' : 'User data not found.'} Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const user = data.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountSettingsTab user={user} />
        </TabsContent>
        <TabsContent value="password">
          <PasswordSettingsTab />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesSettingsTab />
        </TabsContent>
        <TabsContent value="danger">
          <DangerZoneTab userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
