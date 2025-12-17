import { cn } from '@/lib/utils';

type GuessCardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
};

export default function GuessCard({ question, answer, isFlipped }: GuessCardProps) {
  return (
    <div className="group h-80 w-full max-w-md lg:max-w-2xl [perspective:1000px]">
      <div
        className={cn(
          'relative h-full w-full transition-all duration-500 [transform-style:preserve-3d]',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6 [backface-visibility:hidden]">
            <p className="text-2xl font-semibold md:text-3xl">{question}</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-secondary p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-2xl font-semibold text-primary md:text-3xl">{answer}</p>
        </div>
      </div>
    </div>
  );
}
