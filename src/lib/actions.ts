'use server';

import { getFormGuidance, FormGuidanceInput, FormGuidanceOutput } from '@/ai/flows/form-assistant';

export async function getGuidanceAction(input: FormGuidanceInput): Promise<FormGuidanceOutput> {
  try {
    const result = await getFormGuidance(input);
    return result;
  } catch (error) {
    console.error('Error getting form guidance:', error);
    return { guidance: 'Sorry, I was unable to get guidance at this time. Please try again later.' };
  }
}
