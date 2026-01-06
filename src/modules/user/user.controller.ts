//Maneja las rutas y peticiones/respuestas HTTP	-> Service
import type { NextFunction, RequestHandler } from 'express';
import { UserService } from './user.service.js';
import {
   type UserDto,
   type UserUpdateDto,
   type UserCreateDto,
   type UserResponseDto,
} from './user.schema.js';
import * as response from '../../shared/response/ApiResponse.js';
import { Errors } from '../../utils/errors.js';
import { verifyOwnership } from '../../core/middlewares/auth.middleware.js';

export class UserController {
   constructor(private readonly userService: UserService) {}

   getAllOrByNameAndLastname: RequestHandler<
      //RequestHandler: params, res body, req body, req query
      Record<string, never>,
      UserResponseDto[],
      Record<string, never>,
      { name?: string; lastname?: string }
   > = async (_req, res, next: NextFunction) => {
      try {
         // Get all
         if (!_req.validatedQuery?.name && !_req.validatedQuery?.lastname) {
            const users: UserResponseDto[] = await this.userService.getAllUsers();
            return response.success(_req, res, users, 200);
         }

         // Get a filter query for name or/and lastname
         const { name, lastname } = _req.validatedQuery;
         const users: UserResponseDto[] = await this.userService.getByNameAndLastname(
            name,
            lastname,
         );
         return response.success(_req, res, users, 200);
      } catch (err) {
         return next(err);
      }
   };

   getById: RequestHandler<
      { id: UserDto['id'] },
      UserResponseDto | boolean,
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         const params = _req.validatedParams as { id: string } | undefined;
         if (!params?.id) throw new Errors('Parameter id is required');

         // Validar que el cliente sea el propietario del recurso si es user
         verifyOwnership(_req, params.id);

         const user: UserResponseDto | boolean = await this.userService.getByIdUser(params.id);

         return response.success(_req, res, user, 200);
      } catch (err) {
         return next(err);
      }
   };

   postNewUser: RequestHandler<
      Record<string, never>,
      { message: string; id: string },
      UserCreateDto,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         // ! :le dice a TS que no es null ni undefined
         const newUser: UserResponseDto = await this.userService.postNewUser(_req.validatedBody!);
         return response.success(
            _req,
            res,
            {
               message: 'User created successfully',
               id: newUser.id,
            },
            200,
         );
      } catch (err) {
         return next(err);
      }
   };

   patchUser: RequestHandler<
      { id: UserDto['id'] },
      UserResponseDto,
      UserUpdateDto,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      // Record<K, T> objeto clave, valor
      try {
         const params = _req.validatedParams as { id: string } | undefined;
         if (!params?.id) throw new Errors('Parameter id is required');

         verifyOwnership(_req, params.id);

         const updatedUser: UserResponseDto = await this.userService.patchUser(
            params.id,
            _req.validatedBody!,
         );

         return response.success(_req, res, updatedUser, 200);
      } catch (err) {
         return next(err);
      }
   };

   deleteUser: RequestHandler<
      { id: UserDto['id'] },
      string | void,
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         const params = _req.validatedParams as { id: string } | undefined;
         if (!params?.id) throw new Errors('Parameter id is required');

         verifyOwnership(_req, params.id);

         const userDeleted: string | void = await this.userService.deleteUser(params.id);

         return response.success(_req, res, userDeleted, 200);
      } catch (err) {
         return next(err);
      }
   };
}
