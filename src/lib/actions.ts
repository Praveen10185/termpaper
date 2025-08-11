'use server';

import { z } from 'zod';
import { analyzeTextSentiment, type AnalyzeTextSentimentOutput } from '@/ai/flows/analyze-text-sentiment';
import { analyzeCsvSentiment, type AnalyzeCsvSentimentOutput } from '@/ai/flows/analyze-csv-sentiment';

const textSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.').max(5000, 'Text cannot exceed 5000 characters.'),
});

interface TextAnalysisState {
  result?: AnalyzeTextSentimentOutput;
  error?: string;
}

export async function analyzeTextAction(prevState: TextAnalysisState, formData: FormData): Promise<TextAnalysisState> {
  const validatedFields = textSchema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.text?.join(', '),
    };
  }

  try {
    const result = await analyzeTextSentiment({ text: validatedFields.data.text });
    return { result };
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred during analysis.' };
  }
}


interface CsvAnalysisState {
  result?: AnalyzeCsvSentimentOutput;
  error?: string;
}

export async function analyzeCsvAction(csvData: string): Promise<CsvAnalysisState> {
  if (!csvData || csvData.trim().length === 0) {
    return { error: 'CSV data is empty.' };
  }

  try {
    const result = await analyzeCsvSentiment({ csvData });
    return { result };
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred during CSV analysis.' };
  }
}
