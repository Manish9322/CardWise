'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setCards, setLoading, setError, nextCard } from '@/lib/store/features/cards/cardsSlice';
import { getActiveCards } from '@/lib/actions/cardActions';
import ThemeToggle from '@/components/common/ThemeToggle';
import GuessCard from '@/components/game/GuessCard';
import ReactConfetti from 'react-confetti';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Menu, RotateCw, ArrowRight, Search } from 'lucide-react';
import type { Card as CardType } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

function QuestionsSidebar({ cards }: { cards: CardType[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCards = cards.filter(card =>
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 md:top-6 md:right-6 z-10 text-muted-foreground hover:text-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open questions</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>All Questions</SheetTitle>
          <SheetDescription>Browse through all the available questions and their answers.</SheetDescription>
        </SheetHeader>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto mt-4 flex-1">
          {filteredCards.length > 0 ? (
             <div className="space-y-2">
              {filteredCards.map((card, index) => (
                <div key={card.id} className={cn("p-4 rounded-lg", index % 2 === 0 ? "bg-muted/50" : "bg-muted")}>
                  <h4 className="font-semibold text-sm">{card.question}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{card.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-10">
              <p>No questions found.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ConfettiWrapper({ onComplete }: { onComplete: () => void }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({
      width,
      height,
    });
  }, []);

  if (dimensions.width === 0) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={200}
      recycle={false}
      onConfettiComplete={onComplete}
      className="!fixed"
    />
  );
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { cards, currentIndex, isLoading, error } = useAppSelector((state) => state.cards);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    if (newFlippedState) {
        setShowConfetti(true);
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
            "transition-all duration-300 ease-in-out w-full flex-1 flex items-center justify-center",
            isAnimating ? "opacity-0 translate-x-[-50px]" : "opacity-100 translate-x-0"
        )}>
            <GuessCard 
                question={currentCard.question}
                answer={currentCard.answer}
                isFlipped={isFlipped}
            />
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
       {showConfetti && <ConfettiWrapper onComplete={() => setShowConfetti(false)} />}
       <QuestionsSidebar cards={cards} />
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {renderContent()}
      </main>
      <ThemeToggle />
      <div className="fixed bottom-4 left-4 z-10 flex flex-col gap-2">
          <Button 
            onClick={handleReveal}
            variant="ghost" 
            size="icon"
            className="rounded-full bg-card/80 backdrop-blur-sm"
          >
              <RotateCw className="h-6 w-6" />
              <span className="sr-only">{isFlipped ? 'Hide' : 'Reveal'}</span>
          </Button>
          <Button 
            onClick={handleNextCard} 
            variant="ghost"
            size="icon"
            className="rounded-full bg-card/80 backdrop-blur-sm"
            disabled={isAnimating}
          >
              <ArrowRight className="h-6 w-6" />
              <span className="sr-only">Next Card</span>
          </Button>
        </div>
    </div>
  );
}
