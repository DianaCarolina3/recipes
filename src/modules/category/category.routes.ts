import { Router } from 'express';
import { CategoryController } from './category.controller.js';

export const createCategoryRouter = () => {
   const router = Router();

   const categoryController = new CategoryController();

   router.get('/', categoryController.getCategories);

   return router;
};
