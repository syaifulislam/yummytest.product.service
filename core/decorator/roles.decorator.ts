import { SetMetadata } from '@nestjs/common';
export enum UsersRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UsersRole[]) => SetMetadata(ROLES_KEY, roles);