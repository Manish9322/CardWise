'use client';

import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center p-8">
        <Wrench className="mx-auto h-24 w-24 text-primary" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight">
          Under Maintenance
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We are currently performing scheduled maintenance.
        </p>
        <p className="mt-2 text-muted-foreground">
          We expect to be back online shortly. Thank you for your patience!
        </p>
      </div>
    </div>
  );
}
