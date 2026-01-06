import { Router } from 'express';
import { RecipeController } from './recipe.controller.js';
import { RecipeService } from './recipe.service.js';
import { validate } from '../../core/middlewares/validation.middleware.js';
import { authenticateJWT, authorizeRoles } from '../../core/middlewares/auth.middleware.js';
import { createRecipe, updateRecipe } from './recipe.schema.js';
import { RecipeRepository } from './recipe.repository.js';
import { idSchema } from '../../shared/schemas/index.js';

export const createRecipeRouter = () => {
   const router = Router();

   const recipeRepository = new RecipeRepository();
   const recipeService = new RecipeService(recipeRepository);
   const recipeController = new RecipeController(recipeService);

   router.post(
      '/',
      authenticateJWT,
      authorizeRoles('ADMIN', 'USER'),
      validate(createRecipe, 'body'),
      recipeController.postNewRecipe,
   );
   router.get('/', recipeController.listAllRecipes);
   router.get('/:id', validate(idSchema, 'params'), recipeController.getRecipeById);
   router.patch(
      '/:id',
      authenticateJWT,
      authorizeRoles('ADMIN', 'USER'),
      validate(idSchema, 'params'),
      validate(updateRecipe, 'body'),
      recipeController.patchRecipe,
   );
   router.delete(
      '/:id',
      authenticateJWT,
      authorizeRoles('ADMIN', 'USER'),
      validate(idSchema, 'params'),
      recipeController.deleteRecipe,
   );

   return router;
};
