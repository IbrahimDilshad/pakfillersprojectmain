// This file uses server-side code.
'use server';

/**
 * @fileOverview Provides AI-powered guidance for understanding form requirements.
 *
 * - getFormGuidance - A function that retrieves AI guidance for a specific form field.
 * - FormGuidanceInput - The input type for the getFormGuidance function.
 * - FormGuidanceOutput - The return type for the getFormGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormGuidanceInputSchema = z.object({
  formName: z.string().describe('The name of the form.'),
  fieldName: z.string().describe('The name of the field in the form.'),
  userQuestion: z.string().describe('The user question about the form field.'),
});
export type FormGuidanceInput = z.infer<typeof FormGuidanceInputSchema>;

const FormGuidanceOutputSchema = z.object({
  guidance: z.string().describe('The AI-powered guidance for the form field.'),
});
export type FormGuidanceOutput = z.infer<typeof FormGuidanceOutputSchema>;

export async function getFormGuidance(input: FormGuidanceInput): Promise<FormGuidanceOutput> {
  return formGuidanceFlow(input);
}

const formGuidancePrompt = ai.definePrompt({
  name: 'formGuidancePrompt',
  input: {schema: FormGuidanceInputSchema},
  output: {schema: FormGuidanceOutputSchema},
  prompt: `You are an AI assistant that helps users understand form requirements by referencing FAQs and official guidelines.

  Form Name: {{formName}}
  Field Name: {{fieldName}}
  User Question: {{userQuestion}}

  Provide clear and concise guidance to the user based on the information above.
  Focus on answering the user's question directly and provide relevant information from FAQs and official guidelines.
  If the question can't be answered or is not related to the form or field, respond appropriately.
  `,
});

const formGuidanceFlow = ai.defineFlow(
  {
    name: 'formGuidanceFlow',
    inputSchema: FormGuidanceInputSchema,
    outputSchema: FormGuidanceOutputSchema,
  },
  async input => {
    const {output} = await formGuidancePrompt(input);
    return output!;
  }
);
