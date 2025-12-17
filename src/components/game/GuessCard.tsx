import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type GuessCardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
};

export default function GuessCard({ question, answer, isFlipped }: GuessCardProps) {
  return (
    <div className="group h-80 w-full max-w-md lg:max-w-2xl [perspective:1000px]">
      <Card
        className={cn(
          'relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d]',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6 [backface-visibility:hidden]">
          <CardContent className="p-0">
            <p className="text-2xl font-semibold md:text-3xl">{question}</p>
          </CardContent>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-secondary p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardContent className="p-0">
            <p className="text-2xl font-semibold text-primary md:text-3xl">{answer}</p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
