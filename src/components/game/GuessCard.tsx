import { cn } from '@/lib/utils';

type GuessCardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
};

export default function GuessCard({ question, answer, isFlipped }: GuessCardProps) {
  return (
    <div className="relative h-96 w-full max-w-md lg:max-w-3xl flex items-center justify-center">
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out',
          isFlipped ? 'opacity-0' : 'opacity-100'
        )}
      >
        <p className="text-3xl font-semibold md:text-5xl text-center leading-tight">{question}</p>
      </div>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out',
          isFlipped ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p className="text-3xl font-bold text-primary md:text-5xl text-center leading-tight">{answer}</p>
      </div>
    </div>
  );
}
