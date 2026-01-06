import type { CreateRecipeDto, RecipeResponseDto, UpdateRecipeDto } from './recipe.schema.js';
import type { RecipeRepository } from './recipe.repository.js';
import { Errors } from '../../utils/errors.js';

export class RecipeService {
   constructor(private readonly recipeRepository: RecipeRepository) {}

   async createNewRecipe(body: CreateRecipeDto, userId: string): Promise<RecipeResponseDto> {
      if (!userId) {
         throw new Errors('User Id is required', 400);
      }
      return await this.recipeRepository.createNewRecipe(body, userId);
   }

   async listAllRecipes(): Promise<RecipeResponseDto[]> {
      return await this.recipeRepository.findAllRecipes();
   }

   async getRecipeById(id: string): Promise<RecipeResponseDto | boolean> {
      const recipe = await this.recipeRepository.getRecipeById(id);

      if (!recipe) {
         throw new Errors('Recipe not found', 404);
      }
      return recipe;
   }

   async updateRecipe(
      id: string,
      body: UpdateRecipeDto,
      userId: string,
   ): Promise<RecipeResponseDto> {
      const existsRecipe = await this.recipeRepository.findById(id);
      if (!existsRecipe) {
         throw new Errors('Recipe no exists', 404);
      }
      const validateOwnerRecipe = await this.recipeRepository.findRecipeOfUserOwner(id, userId);
      if (!validateOwnerRecipe) {
         throw new Errors('You are not allowed to update this recipe', 403);
      }

      return await this.recipeRepository.updateRecipe(id, body);
   }

   async deleteRecipe(id: string, userId: string): Promise<string | void> {
      const existsRecipe = await this.recipeRepository.findById(id);
      if (!existsRecipe) {
         throw new Errors('Recipe no exists', 404);
      }
      const validateOwnerRecipe = await this.recipeRepository.findRecipeOfUserOwner(id, userId);
      if (!validateOwnerRecipe) {
         throw new Errors('You are not allowed to delete this recipe', 403);
      }

      const result = await this.recipeRepository.delete(id);
      if (result) {
         return `Recipe ${id} deleted`;
      }
   }
}
