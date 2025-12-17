'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setCards, setLoading, setError, nextCard } from '@/lib/store/features/cards/cardsSlice';
import { getActiveCards } from '@/lib/actions/cardActions';
import ThemeToggle from '@/components/common/ThemeToggle';
import GuessCard from '@/components/game/GuessCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Menu, RotateCw, ArrowRight } from 'lucide-react';
import type { Card as CardType } from '@/lib/definitions';
import { cn } from '@/lib/utils';

function QuestionsSidebar({ cards }: { cards: CardType[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 md:top-6 md:right-6 z-10 text-muted-foreground hover:text-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open questions</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>All Questions</SheetTitle>
        </SheetHeader>
        <Accordion type="single" collapsible className="w-full mt-4">
          {cards.map((card) => (
            <AccordionItem value={card.id} key={card.id}>
              <AccordionTrigger>{card.question}</AccordionTrigger>

              <AccordionContent>{card.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SheetContent>
    </Sheet>
  )
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { cards, currentIndex, isLoading, error } = useAppSelector((state) => state.cards);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        dispatch(setLoading(true));
        const activeCards = await getActiveCards();
        // Simple shuffle
        const shuffledCards = activeCards.sort(() => Math.random() - 0.5);
        dispatch(setCards(shuffledCards));
      } catch (e) {
        dispatch(setError('Failed to load cards.'));
      }
    };
    fetchCards();
  }, [dispatch]);

  const handleReveal = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  };

  const handleNextCard = () => {
    setIsAnimating(true);
    setTimeout(() => {
        setIsFlipped(false);
        dispatch(nextCard());
        setIsAnimating(false);
    }, 300);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center w-full max-w-2xl">
            <Skeleton className="h-[24rem] w-full rounded-xl" />
            <div className="mt-12 flex gap-4">
              <Skeleton className="h-14 w-48 rounded-full" />
              <Skeleton className="h-14 w-48 rounded-full" />
            </div>
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

    if (cards.length === 0) {
      return (
        <Alert className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Active Questions!</AlertTitle>
          <AlertDescription>There are no active questions to play right now. Add some in the admin panel!</AlertDescription>
        </Alert>
      );
    }

    const currentCard = cards[currentIndex];

    return (
      <div className="flex flex-col items-center justify-center text-center w-full flex-1">
        <div className={cn(
            "transition-all duration-300 ease-in-out w-full",
            isAnimating ? "opacity-0 translate-x-[-50px]" : "opacity-100 translate-x-0"
        )}>
            <GuessCard 
                question={currentCard.question}
                answer={currentCard.answer}
                isFlipped={isFlipped}
            />
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Button 
            onClick={handleReveal}
            variant="outline" 
            size="lg"
            className="rounded-full w-48 h-14 text-base"
          >
              <RotateCw />
              {isFlipped ? 'Hide' : 'Reveal'}
          </Button>
          <Button 
            onClick={handleNextCard} 
            size="lg"
            className="rounded-full w-48 h-14 text-base"
            disabled={isAnimating}
          >
              Next
              <ArrowRight />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
       <QuestionsSidebar cards={cards} />
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {renderContent()}
      </main>
      <ThemeToggle />
    </div>
  );
}
