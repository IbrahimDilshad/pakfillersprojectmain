'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { getGuidanceAction } from '@/lib/actions';
import { Sparkles } from 'lucide-react';

interface AIAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formName: string;
  fieldName: string;
  fieldLabel: string;
}

export function AIAssistant({ open, onOpenChange, formName, fieldName, fieldLabel }: AIAssistantProps) {
  const [question, setQuestion] = useState('');
  const [guidance, setGuidance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetGuidance = async () => {
    if (!question) return;
    setIsLoading(true);
    setGuidance('');
    try {
      const result = await getGuidanceAction({ formName, fieldName, userQuestion: question });
      setGuidance(result.guidance);
    } catch (error) {
      setGuidance('An error occurred while fetching guidance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setQuestion('');
      setGuidance('');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            AI Form Assistant
          </DialogTitle>
          <DialogDescription>
            Ask a question about the &quot;{fieldLabel}&quot; field. Our AI will provide guidance based on FAQs and official rules.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={`e.g., "What documents do I need for this?"`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
          />
        </div>
        {guidance && (
          <div className="rounded-lg border bg-secondary/50 p-4 text-sm">
            <p className="whitespace-pre-wrap">{guidance}</p>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleGetGuidance} disabled={isLoading || !question}>
            {isLoading ? 'Getting guidance...' : 'Get Guidance'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
