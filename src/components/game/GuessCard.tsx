import { cn } from '@/lib/utils';

type GuessCardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
};

export default function GuessCard({ question, answer, isFlipped }: GuessCardProps) {
  return (
    <div className="relative h-80 w-full max-w-md lg:max-w-2xl flex items-center justify-center">
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out',
          isFlipped ? 'opacity-0' : 'opacity-100'
        )}
      >
        <p className="text-2xl font-semibold md:text-3xl text-center">{question}</p>
      </div>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out',
          isFlipped ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p className="text-2xl font-semibold text-primary md:text-3xl text-center">{answer}</p>
      </div>
    </div>
  );
}
