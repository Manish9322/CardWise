import CardForm from '@/components/admin/CardForm';
import { createCardAction } from '@/lib/actions/cardActions';

export default function NewCardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Card</h1>
        <p className="text-muted-foreground">Fill out the form to add a new question to the deck.</p>
      </div>
      <CardForm formAction={createCardAction} />
    </div>
  );
}
