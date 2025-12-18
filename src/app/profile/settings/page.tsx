'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
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

function AccountSettingsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="johndoe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="johndoe@example.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" defaultValue="123-456-7890" />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}

function PasswordSettingsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    For your security, we recommend choosing a strong password.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Update Password</Button>
            </CardFooter>
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
    )
}

function DangerZoneTab() {
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    // In a real app, this would be a server action to delete the user
    console.log('Deleting account...');
    setShowDeleteModal(false);
    toast({
      title: 'Account Deletion Initiated',
      description: 'Your account is scheduled for deletion. You will be logged out.',
      variant: 'destructive',
    });
    setTimeout(() => logout(), 2000);
  };

  return (
    <>
      <Card className="border-red-500 dark:border-red-400">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-500">Danger Zone</CardTitle>
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
          <div className="flex items-center justify-between rounded-lg border border-red-500/50 bg-red-500/5 p-4">
            <div>
              <h4 className="font-medium text-red-600 dark:text-red-500">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
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
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


export default function SettingsPage() {
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
          <AccountSettingsTab />
        </TabsContent>
        <TabsContent value="password">
          <PasswordSettingsTab />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesSettingsTab />
        </TabsContent>
        <TabsContent value="danger">
            <DangerZoneTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
