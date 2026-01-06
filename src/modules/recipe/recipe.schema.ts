import z from 'zod';

export const createRecipe = z.object({
   title: z.string().min(1),
   description: z.string().nullable().optional(),
   prepTime: z.number().int().positive().nullable().optional(),
   cookTime: z.number().int().positive().nullable().optional(),
   servings: z.number().int().positive().nullable().optional(),
   difficulty: z.enum(['bajo', 'medio', 'alto']).nullable().optional(),
   image: z.string().nullable().optional(),
   categoryId: z.uuid(),
   ingredients: z
      .array(
         z.object({
            name: z.string().min(1),
            quantity: z.string().toLowerCase().nullable().optional(),
            unit: z.string().toLowerCase().nullable().optional(),
         }),
      )
      .min(1, 'There must be at least one ingredient'),
   steps: z
      .array(
         z.object({
            order: z.number().int().positive(),
            description: z.string().min(1),
         }),
      )
      .min(1, 'There must be at least one step'),
});
export type CreateRecipeDto = z.infer<typeof createRecipe>;

export const updateRecipe = z.object({
   title: z.string().min(1).optional(),
   description: z.string().nullable().optional(),
   prepTime: z.number().int().positive().nullable().optional(),
   cookTime: z.number().int().positive().nullable().optional(),
   servings: z.number().int().positive().nullable().optional(),
   difficulty: z.enum(['bajo', 'medio', 'alto']).nullable().optional(),
   image: z.string().nullable().optional(),
   categoryId: z.uuid().optional(),
   ingredients: z
      .array(
         z.object({
            name: z.string().min(1),
            quantity: z.string().toLowerCase().nullable().optional(),
            unit: z.string().toLowerCase().nullable().optional(),
         }),
      )
      .optional(),
   steps: z
      .array(
         z.object({
            order: z.number().int().positive(),
            description: z.string().min(1),
         }),
      )
      .optional(),
});

export type UpdateRecipeDto = z.infer<typeof updateRecipe>;

export const recipeResponse = createRecipe.extend({
   id: z.uuid(),
   author: z.object({
      id: z.uuid(),
      name: z.string(),
      lastname: z.string(),
   }),
   category: z.object({
      id: z.uuid(),
      name: z.string(),
   }),
   createdAt: z.string(),
   updatedAt: z.string(),
});

export type RecipeResponseDto = z.infer<typeof recipeResponse>;
