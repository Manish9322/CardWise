'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setCards, setLoading, setError } from '@/lib/store/features/cards/cardsSlice';
import { getAllCards } from '@/lib/actions/cardActions';
import ThemeToggle from '@/components/common/ThemeToggle';
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
import { Terminal, Menu, BookMarked } from 'lucide-react';
import { Card as CardType } from '@/lib/definitions';

function QuestionsSidebar({ cards }: { cards: CardType[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
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
  const { cards, isLoading, error } = useAppSelector((state) => state.cards);
  
  useEffect(() => {
    const fetchCards = async () => {
      try {
        dispatch(setLoading(true));
        const allCards = await getAllCards();
        dispatch(setCards(allCards));
      } catch (e) {
        dispatch(setError('Failed to load cards.'));
      }
    };
    fetchCards();
  }, [dispatch]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="mt-4 h-8 w-64" />
            <Skeleton className="mt-2 h-6 w-48" />
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
          <AlertTitle>No Questions Yet!</AlertTitle>
          <AlertDescription>There are no questions available right now. Check back later!</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="text-center">
        <BookMarked className="mx-auto h-24 w-24 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Ready to Learn?</h1>
        <p className="mt-2 text-muted-foreground">Click the menu in the top right to see all questions.</p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
       {cards.length > 0 && <QuestionsSidebar cards={cards} />}
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        {renderContent()}
      </main>
      <ThemeToggle />
    </div>
  );
}
