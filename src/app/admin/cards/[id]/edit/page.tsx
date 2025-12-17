import CardForm from '@/components/admin/CardForm';
import { getCard, updateCardAction } from '@/lib/actions/cardActions';

export default async function EditCardPage({ params }: { params: { id: string } }) {
  const card = await getCard(params.id);
  const updateActionWithId = updateCardAction.bind(null, params.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Card</h1>
        <p className="text-muted-foreground">Update the details for this card.</p>
      </div>
      <CardForm formAction={updateActionWithId} initialData={card} />
    </div>
  );
}
