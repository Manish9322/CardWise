import { getAllCards } from '@/lib/actions/cardActions';
import CardsDataTable from '@/components/admin/CardsDataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const cards = await getAllCards();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your question and answer cards.</p>
        </div>
        <Button asChild>
            <Link href="/admin/cards/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Card
            </Link>
        </Button>
      </div>
      <CardsDataTable data={cards} />
    </div>
  );
}
