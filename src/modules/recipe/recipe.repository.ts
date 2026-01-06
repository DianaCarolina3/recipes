import { BaseRepository } from '../../shared/repositories/BaseRepository.js';
import { prisma } from '../../core/config/database.js';
import type { CreateRecipeDto, RecipeResponseDto, UpdateRecipeDto } from './recipe.schema.js';

export class RecipeRepository extends BaseRepository<RecipeResponseDto> {
   constructor() {
      super(prisma, prisma.recipe);
   }

   async findAllRecipes(): Promise<RecipeResponseDto[]> {
      return await this.modelDelegate.findMany({
         select: {
            id: true,
            title: true,
            description: true,
            prepTime: true,
            cookTime: true,
            servings: true,
            difficulty: true,
            image: true,
            category: { select: { id: true, name: true } },
            author: { select: { id: true, name: true, lastname: true } },
            ingredients: { select: { name: true, quantity: true, unit: true } },
            steps: { select: { order: true, description: true } },
            createdAt: true,
            updatedAt: true,
         },
      });
   }

   async createNewRecipe(body: CreateRecipeDto, userId: string): Promise<RecipeResponseDto> {
      return await this.modelDelegate.create({
         data: {
            title: body.title,
            description: body.description,
            prepTime: body.prepTime,
            cookTime: body.cookTime,
            servings: body.servings,
            difficulty: body.difficulty,
            image: body.image,
            author: {
               connect: { id: userId },
            },
            category: {
               connect: { id: body.categoryId },
            },
            ingredients: {
               create: body.ingredients,
            },
            steps: {
               create: body.steps,
            },
         },

         select: {
            id: true,
            title: true,
            description: true,
            prepTime: true,
            cookTime: true,
            servings: true,
            difficulty: true,
            image: true,
            category: { select: { id: true, name: true } },
            author: { select: { id: true, name: true, lastname: true } },
            ingredients: { select: { name: true, quantity: true, unit: true } },
            steps: { select: { order: true, description: true } },
            createdAt: true,
            updatedAt: true,
         },
      });
   }

   async getRecipeById(id: string): Promise<RecipeResponseDto> {
      return await this.modelDelegate.findUnique({
         where: { id },

         select: {
            id: true,
            title: true,
            description: true,
            prepTime: true,
            cookTime: true,
            servings: true,
            difficulty: true,
            image: true,
            category: { select: { id: true, name: true } },
            author: { select: { id: true, name: true, lastname: true } },
            ingredients: { select: { name: true, quantity: true, unit: true } },
            steps: { select: { order: true, description: true } },
            createdAt: true,
            updatedAt: true,
         },
      });
   }

   async findRecipeOfUserOwner(id: string, userId: string) {
      return await this.modelDelegate.findFirst({
         where: {
            id: id,
            authorId: userId,
         },
         select: { id: true },
      });
   }

   async updateRecipe(id: string, body: UpdateRecipeDto): Promise<RecipeResponseDto> {
      const { ingredients, steps, ...recipeData } = body;
      return await this.modelDelegate.update({
         where: { id },
         data: {
            ...recipeData,

            // actualiza buscando por name de lo contrario crea
            ...(ingredients && {
               ingredients: {
                  upsert: ingredients.map((ing) => ({
                     where: {
                        recipeId_name: {
                           recipeId: id,
                           name: ing.name,
                        },
                     },
                     update: {
                        quantity: ing.quantity,
                        unit: ing.unit,
                     },
                     create: {
                        name: ing.name,
                        quantity: ing.quantity,
                        unit: ing.unit,
                     },
                  })),
               },
            }),
            // actualiza por orden de pasos de lo contrario crea
            ...(steps && {
               steps: {
                  upsert: steps.map((step) => ({
                     where: {
                        recipeId_order: {
                           recipeId: id,
                           order: step.order,
                        },
                     },
                     update: {
                        description: step.description,
                     },
                     create: {
                        order: step.order,
                        description: step.description,
                     },
                  })),
               },
            }),
         },
         include: {
            ingredients: true,
            steps: true,
         },
      });
   }
}
