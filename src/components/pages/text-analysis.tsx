'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeTextAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SentimentPieChart from '@/components/sentiment-pie-chart';
import { Frown, Loader2, Meh, SmilePlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState = {
  result: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Analyze Sentiment
    </Button>
  );
}

export default function TextAnalysis() {
  const [state, formAction] = useActionState(analyzeTextAction, initialState);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Sentiment Analysis</CardTitle>
            <CardDescription>
              Enter any text below to analyze its sentiment. The AI will break down the emotional tone into positive, negative, and neutral categories.
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent>
              <Textarea
                name="text"
                placeholder="Type or paste your text here..."
                className="min-h-[150px] resize-y"
                required
                minLength={10}
                maxLength={5000}
              />
               {state.error && (
                <p className="text-sm font-medium text-destructive mt-2">{state.error}</p>
              )}
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        {state.result && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>A complete breakdown of the sentiment analysis.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-semibold mb-4 text-center">Sentiment Distribution</h3>
                <SentimentPieChart
                  data={{
                    positive: state.result.positive,
                    negative: state.result.negative,
                    neutral: state.result.neutral,
                  }}
                />
                 <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <SmilePlus className="h-6 w-6 text-green-600" />
                    <span className="font-semibold">{state.result.positive.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">Positive</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Frown className="h-6 w-6 text-red-600" />
                     <span className="font-semibold">{state.result.negative.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">Negative</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Meh className="h-6 w-6 text-gray-600" />
                     <span className="font-semibold">{state.result.neutral.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">Neutral</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Highlighted Text</h3>
                <div
                  className="prose prose-sm max-w-none rounded-md border bg-muted p-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: state.result.highlightedText }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
