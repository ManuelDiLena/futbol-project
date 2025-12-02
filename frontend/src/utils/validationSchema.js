import { z } from 'zod';

export const playerSchema = z.object({
  age: z.coerce
    .number({ required_error: 'Age is mandatory' })
    .min(15, 'You must be at least 15 years old')
    .max(99, 'Invalid age'),
  location: z.string().min(3, 'Location is mandatory'),
  positions: z.array(z.string()).min(1, 'Select at least one position'),
  availability: z.array(z.string()).min(1, 'Select your availability'),
});

export const fieldSchema = z.object({
  fieldName: z.string().min(3, 'Field name is mandatory'),
  location: z.string().min(3, 'Location is mandatory'),
  schedules: z.string().min(1, 'Define the schedules'),
  fieldCount: z.coerce.number().min(1, 'There must be at least 1 field'),
  matchTypes: z.array(z.string()).min(1, 'Select at least one match type'),
});