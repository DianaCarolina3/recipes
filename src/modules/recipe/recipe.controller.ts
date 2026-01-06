import type { RecipeService } from './recipe.service.js';
import type { RequestHandler } from 'express';
import type { CreateRecipeDto, RecipeResponseDto, UpdateRecipeDto } from './recipe.schema.js';
import { Errors } from '../../utils/errors.js';
import { verifyOwnership } from '../../core/middlewares/auth.middleware.js';
import type { IdDto } from '../../shared/schemas/index.js';
import * as response from '../../shared/response/ApiResponse.js';

export class RecipeController {
   constructor(private readonly recipeService: RecipeService) {}

   postNewRecipe: RequestHandler<
      Record<string, never>,
      RecipeResponseDto,
      CreateRecipeDto,
      Record<string, never>
   > = async (_req, res, next) => {
      try {
         const newRecipe: RecipeResponseDto = await this.recipeService.createNewRecipe(
            _req.validatedBody!,
            _req.user?.userId as string,
         );

         return response.success(_req, res, newRecipe, 201);
      } catch (err) {
         next(err);
      }
   };

   listAllRecipes: RequestHandler<
      Record<string, never>,
      RecipeResponseDto[],
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next) => {
      try {
         const recipes: RecipeResponseDto[] = await this.recipeService.listAllRecipes();

         return response.success(_req, res, recipes, 200);
      } catch (err) {
         next(err);
      }
   };

   getRecipeById: RequestHandler<
      { id: string },
      RecipeResponseDto | boolean,
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next) => {
      try {
         if (!_req.validatedParams?.id) {
            throw new Errors('Id is required', 400);
         }
         const recipe: RecipeResponseDto | boolean = await this.recipeService.getRecipeById(
            _req.validatedParams.id,
         );

         return response.success(_req, res, recipe, 200);
      } catch (err) {
         next(err);
      }
   };

   patchRecipe: RequestHandler<IdDto, RecipeResponseDto, UpdateRecipeDto, Record<string, never>> =
      async (_req, res, next) => {
         // Record<K, T> objeto clave, valor
         try {
            const params = _req.validatedParams as { id: string } | undefined;
            if (!params?.id) throw new Errors('Parameter id is required');
            if (!_req.user?.userId) throw new Errors('Authentication required', 401);

            verifyOwnership(_req, _req.user?.userId);

            const updatedRecipe: RecipeResponseDto = await this.recipeService.updateRecipe(
               _req.params.id,
               _req.validatedBody!,
               _req.user.userId,
            );

            return response.success(_req, res, updatedRecipe, 200);
         } catch (err) {
            return next(err);
         }
      };

   deleteRecipe: RequestHandler<IdDto, string, Record<string, never>, Record<string, never>> =
      async (_req, res, next) => {
         try {
            const params = _req.validatedParams as { id: string } | undefined;
            if (!params?.id) throw new Errors('Parameter id is required');
            if (!_req.user?.userId) throw new Errors('Authentication required', 401);

            verifyOwnership(_req, _req.user?.userId);

            const recipeDeleted: string | void = await this.recipeService.deleteRecipe(
               params.id,
               _req.user?.userId,
            );

            return response.success(_req, res, recipeDeleted, 200);
         } catch (err) {
            return next(err);
         }
      };
}
