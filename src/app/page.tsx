'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setCards, nextCard, setLoading, setError } from '@/lib/store/features/cards/cardsSlice';
import { getActiveCards } from '@/lib/actions/cardActions';
import ThemeToggle from '@/components/common/ThemeToggle';
import GuessCard from '@/components/game/GuessCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, ArrowRight, Eye } from 'lucide-react';

export default function Home() {
  const dispatch = useAppDispatch();
  const { cards, currentIndex, isLoading, error } = useAppSelector((state) => state.cards);
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    const fetchCards = async () => {
      try {
        dispatch(setLoading(true));
        const activeCards = await getActiveCards();
        dispatch(setCards(activeCards));
      } catch (e) {
        dispatch(setError('Failed to load cards.'));
      }
    };
    fetchCards();
  }, [dispatch]);

  const handleAction = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      dispatch(nextCard());
      setIsFlipped(false);
    }
  };

  const currentCard = cards[currentIndex];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-md lg:max-w-2xl">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="mt-8 h-12 w-40 self-center" />
        </div>
      );
    }

    if (error) {
       return (
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
       );
    }

    if (!currentCard) {
      return (
        <Alert className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>All Done!</AlertTitle>
          <AlertDescription>You've gone through all the cards. Come back later for more!</AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <GuessCard
          key={currentCard.id}
          question={currentCard.question}
          answer={currentCard.answer}
          isFlipped={isFlipped}
        />
        <Button onClick={handleAction} size="lg" className="mt-8 min-w-[150px] bg-primary hover:bg-primary/90">
          {isFlipped ? <ArrowRight /> : <Eye />}
          <span className="sr-only">{isFlipped ? 'Next Question' : 'Show Answer'}</span>
        </Button>
      </>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        {renderContent()}
      </main>
      <ThemeToggle />
    </div>
  );
}
