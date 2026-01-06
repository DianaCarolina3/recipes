import { z, ZodError, type ZodSchema } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import * as response from '../../shared/response/ApiResponse.js';
import { cleanObject } from '../../utils/cleanObject.js';

export type TargetValidation = 'body' | 'query' | 'params';

const handleErrorValidation = (
   error: unknown,
   _req: Request,
   res: Response,
   next: NextFunction,
) => {
   if (error instanceof ZodError) {
      return response.error(_req, res, z.flattenError(error).fieldErrors, 422);
   }
   return next(error);
};

export const validate = (schema: ZodSchema, target: TargetValidation) => {
   return (_req: Request, res: Response, next: NextFunction) => {
      try {
         let dataToValidate = { ..._req[target] };

         // limpiar los datos por si el cliente envia un "", null o campo vacio
         if (target === 'body') {
            const cleaned = cleanObject(dataToValidate);

            // si viene un array con ingredients y steps no limpiamos los campos
            if (dataToValidate.ingredients) cleaned.ingredients = dataToValidate.ingredients;
            if (dataToValidate.steps) cleaned.steps = dataToValidate.steps;

            dataToValidate = cleaned;
         }

         const validated = schema.parse(dataToValidate);

         // no modificamos la req solo la agregamos a la respuesta
         if (target === 'body') {
            _req.validatedBody = validated;
         } else if (target === 'query') {
            _req.validatedQuery = validated as any;
         } else if (target === 'params') {
            _req.validatedParams = validated as any;
         }

         return next();
      } catch (error) {
         handleErrorValidation(error, _req, res, next);
      }
   };
};

// si la req es vacia no valida para las query
export const validateOpcional = (schema: ZodSchema, target: TargetValidation) => {
   return (_req: Request, res: Response, next: NextFunction) => {
      try {
         let dataToValidate = { ..._req[target] };

         if (Object.keys(dataToValidate).length === 0) {
            return next();
         }

         if (target === 'body') {
            const cleaned = cleanObject(dataToValidate);

            // si viene un array con ingredients y steps no limpiamos los campos
            if (dataToValidate.ingredients) cleaned.ingredients = dataToValidate.ingredients;
            if (dataToValidate.steps) cleaned.steps = dataToValidate.steps;

            dataToValidate = cleaned;
         }

         const validated = schema.parse(dataToValidate);

         // no modificamos la req solo la agregamos a la respuesta
         if (target === 'body') {
            _req.validatedBody = validated;
         } else if (target === 'query') {
            _req.validatedQuery = validated as any;
         } else if (target === 'params') {
            _req.validatedParams = validated as any;
         }

         return next();
      } catch (error) {
         handleErrorValidation(error, _req, res, next);
      }
   };
};
