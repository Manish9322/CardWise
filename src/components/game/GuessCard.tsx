import { cn } from '@/lib/utils';

type GuessCardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
};

export default function GuessCard({ question, answer, isFlipped }: GuessCardProps) {
  return (
    <div className="relative h-96 w-full flex items-center justify-center">
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out',
          isFlipped ? 'opacity-0' : 'opacity-100'
        )}
      >
        <p className="text-2xl md:text-4xl font-semibold text-center leading-tight">{question}</p>
      </div>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out',
          isFlipped ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p className="text-2xl md:text-4xl font-bold text-primary text-center leading-tight">{answer}</p>
      </div>
    </div>
  );
}
