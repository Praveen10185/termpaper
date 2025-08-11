'use client';

import { useState, useTransition } from 'react';
import { analyzeCsvAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SentimentPieChart from '@/components/sentiment-pie-chart';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import type { AnalyzeCsvSentimentOutput } from '@/ai/flows/analyze-csv-sentiment';

interface CsvData {
  headers: string[];
  rows: string[][];
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCsvSentimentOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid CSV file.',
        });
        return;
      }
      setFile(selectedFile);
      setAnalysisResult(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
        parseCsv(text);
      };
      reader.readAsText(selectedFile);
    }
  };

  const parseCsv = (text: string) => {
    try {
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setCsvData(null);
        toast({ variant: 'destructive', title: 'Invalid CSV', description: 'CSV must have a header and at least one row.' });
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
      setCsvData({ headers, rows });
    } catch (error) {
      setCsvData(null);
      toast({ variant: 'destructive', title: 'Parsing Error', description: 'Could not parse the CSV file.' });
    }
  };

  const handleAnalyze = () => {
    if (!fileContent) {
      toast({
        variant: 'destructive',
        title: 'No File Content',
        description: 'Please upload a file to analyze.',
      });
      return;
    }
    startTransition(async () => {
      const { result, error } = await analyzeCsvAction(fileContent);
      if (error) {
        toast({ variant: 'destructive', title: 'Analysis Error', description: error });
      } else if (result) {
        setAnalysisResult(result);
      }
    });
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Data Analysis Dashboard</CardTitle>
            <CardDescription>
              Upload a CSV file to perform sentiment analysis on its content. The dashboard will provide a high-level overview of the sentiment distribution.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-auto flex-1">
              <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="pl-12"/>
              <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button onClick={handleAnalyze} disabled={!file || isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Analyze CSV
            </Button>
          </CardContent>
          {file && (
             <CardFooter>
               <p className="text-sm text-muted-foreground">
                 Loaded file: <span className="font-medium text-foreground">{file.name}</span>
               </p>
             </CardFooter>
          )}
        </Card>
        
        <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              {csvData && (
                <Card>
                  <CardHeader>
                    <CardTitle>CSV Data Preview</CardTitle>
                    <CardDescription>A preview of the first few rows from your uploaded file.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-auto rounded-md border">
                        <Table>
                          <TableHeader className="sticky top-0 bg-muted">
                            <TableRow>
                              {csvData.headers.map((header) => (
                                <TableHead key={header}>{header}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {csvData.rows.slice(0, 10).map((row, index) => (
                              <TableRow key={index}>
                                {row.map((cell, cellIndex) => (
                                  <TableCell key={cellIndex}>{cell}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="md:col-span-2">
              {analysisResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Sentiment Breakdown</CardTitle>
                      <CardDescription>Overall sentiment distribution in the dataset.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SentimentPieChart data={analysisResult.sentimentBreakdown} />
                    </CardContent>
                  </Card>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
