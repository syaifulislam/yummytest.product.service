import { Injectable, CanActivate, ExecutionContext, createParamDecorator, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { UsersRole } from '../decorator/roles.decorator';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
const config = new ConfigService();

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user
  },
);

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UsersRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const jwt = new JwtService({
      secret: config.get('JWT_SECRET_KEY'),
      signOptions: {
        expiresIn: config.get('JWT_EXPIRATION_TIME')
      }
    })
    const ctx = GqlExecutionContext.create(context);
    const authHeaders = ctx.getContext().req.headers.authorization
    if(!authHeaders) return true
    const token = (authHeaders as string).split(' ')[1];
    const verify = jwt.verify(token)
    if (!requiredRoles.some((role) => verify.roles?.includes(role))) {
      throw new ForbiddenException()
    }
    
    return true
  }
}
