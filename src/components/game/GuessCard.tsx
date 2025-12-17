import { cn } from '@/lib/utils';

type GuessCardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
};

export default function GuessCard({ question, answer, isFlipped }: GuessCardProps) {
  return (
    <div className="relative h-96 w-full max-w-full flex items-center justify-center">
      <div
        className={cn(
          'flex items-center justify-center p-6 text-5xl md:text-7xl font-semibold text-center leading-tight transition-opacity duration-300 ease-in-out',
          isFlipped ? 'opacity-0' : 'opacity-100'
        )}
      >
        {question}
      </div>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center p-6 text-5xl md:text-7xl font-bold text-primary text-center leading-tight transition-opacity duration-300 ease-in-out',
          isFlipped ? 'opacity-100' : 'opacity-0'
        )}
      >
        {answer}
      </div>
    </div>
  );
}
