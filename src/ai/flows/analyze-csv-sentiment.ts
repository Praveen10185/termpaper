'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the sentiment of CSV data.
 *
 * It exports:
 * - `analyzeCsvSentiment`: A function that takes CSV data as input and returns a sentiment analysis.
 * - `AnalyzeCsvSentimentInput`: The input type for the analyzeCsvSentiment function.
 * - `AnalyzeCsvSentimentOutput`: The return type for the analyzeCsvSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCsvSentimentInputSchema = z.object({
  csvData: z
    .string()
    .describe("CSV data as a string."),
});
export type AnalyzeCsvSentimentInput = z.infer<typeof AnalyzeCsvSentimentInputSchema>;

const SentimentBreakdownSchema = z.object({
    positive: z.number().describe('The proportion of positive sentiments.'),
    negative: z.number().describe('The proportion of negative sentiments.'),
    neutral: z.number().describe('The proportion of neutral sentiments.'),
});

const AnalyzeCsvSentimentOutputSchema = z.object({
  sentimentBreakdown: SentimentBreakdownSchema.describe('The sentiment analysis breakdown of the CSV data.'),
});
export type AnalyzeCsvSentimentOutput = z.infer<typeof AnalyzeCsvSentimentOutputSchema>;

export async function analyzeCsvSentiment(input: AnalyzeCsvSentimentInput): Promise<AnalyzeCsvSentimentOutput> {
  return analyzeCsvSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCsvSentimentPrompt',
  input: {schema: AnalyzeCsvSentimentInputSchema},
  output: {schema: AnalyzeCsvSentimentOutputSchema},
  prompt: `You are a sentiment analysis expert. Analyze the sentiment of the following CSV data and provide a breakdown of positive, negative, and neutral sentiments.

CSV Data:
{{{csvData}}}

Provide the sentiment breakdown as a JSON object with 'positive', 'negative', and 'neutral' keys representing the proportion of each sentiment.`,}
);

const analyzeCsvSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCsvSentimentFlow',
    inputSchema: AnalyzeCsvSentimentInputSchema,
    outputSchema: AnalyzeCsvSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
