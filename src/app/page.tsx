
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useGetQuestionsQuery } from '@/utils/services/api';
import ThemeToggle from '@/components/common/ThemeToggle';
import GuessCard from '@/components/game/GuessCard';
import GuessCardSkeleton from '@/components/game/GuessCardSkeleton';
import QuestionsSidebarSkeleton from '@/components/game/QuestionsSidebarSkeleton';
import IntroAnimation from '@/components/game/IntroAnimation';
import ReactConfetti from 'react-confetti';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Menu, Eye, ArrowRight, Search, User, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function QuestionsSidebar({ allQuestions, isLoading }: { allQuestions: any[]; isLoading: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter only active questions for the sidebar
  const activeQuestions = useMemo(() => {
    if (!allQuestions) return [];
    return allQuestions.filter((card: any) => card.status === 'active');
  }, [allQuestions]);

  const filteredCards = activeQuestions.filter(card =>
    card.question.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 rounded-full">
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
            disabled={isLoading}
          />
        </div>
        <div className="overflow-y-auto mt-4 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoading ? (
            <QuestionsSidebarSkeleton />
          ) : filteredCards.length > 0 ? (
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
              <p>No questions found for your search.</p>
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
  const { data: allQuestions, isLoading, error: queryError } = useGetQuestionsQuery(undefined);
  const [showIntro, setShowIntro] = useState(true);

  // Once loading is complete, hide the intro after its animation finishes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowIntro(false), 2500); // Duration of intro animation + delay
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const cards = useMemo(() => {
    if (!allQuestions) return [];
    const activeCards = allQuestions.filter((card: any) => card.status === 'active');
    return activeCards.sort(() => Math.random() - 0.5);
  }, [allQuestions]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

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
        if (cards.length > 0) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
        }
        setIsAnimating(false);
    }, 300);
  };

  const handleTestDB = async () => {
    const response = await fetch('/api/test-connection');
    const data = await response.json();
    if (data.success) {
      toast({
        title: 'Success!',
        description: data.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: data.error,
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
       return null; // Don't render anything while loading, intro animation will be shown
    }

    if (queryError) {
       return (
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load questions. Please try again later.</AlertDescription>
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
    
    if (!currentCard) {
      return (
        <div className="flex flex-col items-center justify-center text-center w-full flex-1">
          <GuessCardSkeleton />
        </div>
      );
    }

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
       <AnimatePresence>
         {showIntro && <IntroAnimation />}
       </AnimatePresence>
       
       {showConfetti && <ConfettiWrapper onComplete={() => setShowConfetti(false)} />}
       
       <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex items-center gap-2">
        <QuestionsSidebar allQuestions={allQuestions || []} isLoading={isLoading} />
       </div>
       
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {renderContent()}
      </main>
      
      <div className="fixed top-4 left-4 z-10 flex flex-col gap-2">
        <Button asChild size="icon" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">
          <Link href="/profile">
            <User className="h-6 w-6" />
            <span className="sr-only">Go to Profile</span>
          </Link>
        </Button>
        <ThemeToggle />
      </div>
      
      <div className="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-row gap-2">
          <Button 
            onClick={handleReveal}
            size="icon"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            disabled={cards.length === 0}
          >
              <Eye className="h-6 w-6" />
              <span className="sr-only">{isFlipped ? 'Hide' : 'Reveal'}</span>
          </Button>
          <Button 
            onClick={handleNextCard} 
            size="icon"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            disabled={isAnimating || cards.length === 0}
          >
              <ArrowRight className="h-6 w-6" />
              <span className="sr-only">Next Card</span>
          </Button>
        </div>
    </div>
  );
}
