import type { PrismaClient } from '@prisma/client';
import { Errors } from '../../utils/errors.js';

export class BaseRepository<TModel> {
   constructor(
      protected readonly prisma: PrismaClient,
      protected readonly modelDelegate: any,
   ) {}

   async findAll(): Promise<TModel[]> {
      return this.modelDelegate.findMany();
   }

   async findById(id: string): Promise<TModel | boolean> {
      const result = await this.modelDelegate.findUnique({ where: { id } });
      if (result === null) return false;
      return result;
   }

   async create(data: Record<string, any>): Promise<TModel> {
      return this.modelDelegate.create({ data });
   }

   async delete(id: string): Promise<TModel> {
      const result = await this.modelDelegate.delete({ where: { id: id } });
      if (result === null) {
         throw new Errors('Error deleting', 500);
      }
      return result;
   }
}
