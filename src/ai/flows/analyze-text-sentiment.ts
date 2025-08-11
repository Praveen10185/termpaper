'use server';

/**
 * @fileOverview A text sentiment analysis AI agent.
 *
 * - analyzeTextSentiment - A function that handles the text sentiment analysis process.
 * - AnalyzeTextSentimentInput - The input type for the analyzeTextSentiment function.
 * - AnalyzeTextSentimentOutput - The return type for the analyzeTextSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextSentimentInputSchema = z.object({
  text: z.string().describe('The text to analyze for sentiment.'),
});
export type AnalyzeTextSentimentInput = z.infer<typeof AnalyzeTextSentimentInputSchema>;

const AnalyzeTextSentimentOutputSchema = z.object({
  positive: z.number().describe('The percentage of positive sentiment in the text.'),
  negative: z.number().describe('The percentage of negative sentiment in the text.'),
  neutral: z.number().describe('The percentage of neutral sentiment in the text.'),
  highlightedText: z.string().describe('The text with words highlighted based on sentiment.'),
});
export type AnalyzeTextSentimentOutput = z.infer<typeof AnalyzeTextSentimentOutputSchema>;

export async function analyzeTextSentiment(input: AnalyzeTextSentimentInput): Promise<AnalyzeTextSentimentOutput> {
  return analyzeTextSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextSentimentPrompt',
  input: {schema: AnalyzeTextSentimentInputSchema},
  output: {schema: AnalyzeTextSentimentOutputSchema},
  prompt: `You are a sentiment analysis expert. Analyze the sentiment of the following text and provide a breakdown of positive, negative, and neutral sentiments as percentages. Also, highlight words in the text with colors corresponding to their sentiment (green for positive, red for negative, grey for neutral).

Text: {{{text}}}

Output format: 
{
  "positive": 0.0,
  "negative": 0.0,
  "neutral": 0.0,
  "highlightedText": "<span style='color: green;'>positive word</span> <span style='color: red;'>negative word</span> <span style='color: grey;'>neutral word</span>"
}
`,
});

const analyzeTextSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeTextSentimentFlow',
    inputSchema: AnalyzeTextSentimentInputSchema,
    outputSchema: AnalyzeTextSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
