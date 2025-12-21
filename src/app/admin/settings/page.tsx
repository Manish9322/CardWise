
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
import { useToast } from '@/hooks/use-toast';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/utils/services/api';
import { ManageUsersSkeleton } from '@/components/admin/skeletons/ManageUsersSkeleton';


function AccountSettingsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Account</CardTitle>
                <CardDescription>Update your administrator account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="AdminUser" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@cardwise.com" />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}

function GeneralSettingsTab() {
    const { data: settings, isLoading: isLoadingSettings } = useGetSettingsQuery(undefined);
    const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateSettingsMutation();
    const { toast } = useToast();

    const handleSettingChange = async (key: 'isMaintenanceMode' | 'allowUserRegistrations', value: boolean) => {
        try {
            await updateSettings({ [key]: value }).unwrap();
            toast({
                title: 'Settings Updated',
                description: `Setting '${key}' has been updated.`,
            });
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update settings.',
            });
        }
    };
    
    if (isLoadingSettings) {
        return <ManageUsersSkeleton />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                    Manage application-wide settings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-medium">Site Maintenance</h4>
                        <p className="text-sm text-muted-foreground">Put the site in maintenance mode.</p>
                    </div>
                    <Switch
                        checked={settings?.isMaintenanceMode}
                        onCheckedChange={(checked) => handleSettingChange('isMaintenanceMode', checked)}
                        disabled={isUpdatingSettings}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-medium">User Registrations</h4>
                        <p className="text-sm text-muted-foreground">Allow new users to register.</p>
                    </div>
                    <Switch 
                        checked={settings?.allowUserRegistrations}
                        onCheckedChange={(checked) => handleSettingChange('allowUserRegistrations', checked)}
                        disabled={isUpdatingSettings}
                    />
                </div>
            </CardContent>
             <CardFooter>
                <Button>Save Settings</Button>
            </CardFooter>
        </Card>
    );
}

function DangerZoneTab() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `Action: ${action}`,
      description: 'This is a placeholder and has not been implemented.',
    });
  }

  return (
    <>
      <Card className="border-purple-500 dark:border-purple-400">
        <CardHeader>
          <CardTitle className="text-purple-600 dark:text-purple-500">Danger Zone</CardTitle>
          <CardDescription>
            These actions can have significant consequences. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-purple-500/50 bg-purple-500/5 p-4">
            <div>
              <h4 className="font-medium text-purple-600 dark:text-purple-500">Reset All Data</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete all questions and user-contributed data.
              </p>
            </div>
            <Button variant="default" onClick={() => handleAction('Reset Data')} className="bg-primary hover:bg-purple-500/90">
              Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}


export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your administrator account and application settings.
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountSettingsTab />
        </TabsContent>
        <TabsContent value="general">
          <GeneralSettingsTab />
        </TabsContent>
        <TabsContent value="danger">
            <DangerZoneTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
