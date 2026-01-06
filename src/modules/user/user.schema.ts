import * as z from 'zod';

export const userSchema = z.object({
   id: z.uuid(),
   // trim quita espacios en blanco al inicio y al final, no en el medio
   name: z.string().trim().min(2, 'Name is required'),
   lastname: z.string().trim().min(1, 'Lastname is required'),
   // puede aceptar string o number y si number lo pasa a string
   email: z.email().transform((value) => value.toLowerCase()),
   password: z.string({ error: 'Must be a string' }).trim().min(4, 'Required minimum 4 characters'),
   cel: z
      .union([z.string(), z.number()])
      .transform((value) => String(value).trim())
      .optional(),
   birthdate: z.iso.date().optional(),
   photo: z
      .url({
         error: 'Must be URL image or a secure version of HTTP',
         protocol: /^https$/,
      })
      .trim()
      .default('https://cdn-icons-png.flaticon.com/512/12225/12225881.png')
      .optional(),
});

// input = lo que recibo del cliente

// pick solo usa name y lastname del userSchema
export const nameAndLastnameSchema = userSchema
   .pick({ name: true, lastname: true })
   .partial()
   .refine((data) => data.name || data.lastname, { message: 'Name or lastname is required' });

export const userCreateSchema = userSchema.omit({
   id: true,
});

export const userUpdateSchema = userSchema
   .omit({
      id: true,
   })
   .partial();

export type UserDto = z.infer<typeof userSchema>;

export type UserCreateDto = z.infer<typeof userCreateSchema>;

export type UserUpdateDto = z.infer<typeof userUpdateSchema>;

// output = lo que devuelvo al cliente
export const userResponseSchema = z.object({
   id: z.uuid(),
   name: z.string(),
   lastname: z.string(),
   email: z.email(),
   cel: z.string().nullable(),
   birthdate: z.date().nullable(),
   photo: z.string().nullable(),
   createdAt: z.date(),
   updatedAt: z.date(),
});

export type UserResponseDto = z.infer<typeof userResponseSchema>;

// parse = para validacion interna de datos, detiene ejecucion si error y lanza throw
// safeParse = para validar datos externos sin expulsion, maneja el error y devuelve objeto

// filtros y busquedas (si aplica)
