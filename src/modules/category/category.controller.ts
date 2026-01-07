import { BaseRepository } from '../../shared/repositories/BaseRepository.js';
import { prisma } from '../../core/config/database.js';
import * as response from '../../shared/response/ApiResponse.js';
import type { Request, Response, NextFunction } from 'express';

interface CategoriesResponse {
   id: string;
   name: string;
   createdAt: string;
   updatedAt: string;
}

export class CategoryController extends BaseRepository<CategoriesResponse> {
   constructor() {
      super(prisma, prisma.category);
   }

   getCategories = async (_req: Request, res: Response, next: NextFunction) => {
      try {
         const result: CategoriesResponse[] = await this.modelDelegate.findMany({
            orderBy: { name: 'asc' },
         });

         response.success(_req, res, result, 200);
      } catch (err) {
         next(err);
      }
   };
}
