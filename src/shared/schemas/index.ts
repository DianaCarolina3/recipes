import z from 'zod';

export const idSchema = z
   .object({
      id: z.uuid(),
   })
   .refine((data) => data.id, { message: 'Id is required' });

export type IdDto = z.infer<typeof idSchema>;
