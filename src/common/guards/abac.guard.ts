import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABAC_ACTION_KEY, ABAC_RESOURCE_KEY } from './abac.decorator.js';
import type { AbacContext, AbacPolicy } from './abac.interface.js';

interface RequestUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest {
  user?: RequestUser;
}

@Injectable()
export class AbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const resource = this.reflector.getAllAndOverride<string>(
      ABAC_RESOURCE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const action = this.reflector.getAllAndOverride<string>(ABAC_ACTION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!resource || !action) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user context');
    }

    const abacContext: AbacContext = {
      subject: { userId: user.userId, email: user.email },
      resource,
      action,
    };

    const policy = this.resolvePolicy(resource);
    if (!policy.evaluate(abacContext)) {
      throw new ForbiddenException(`Access denied: ${action} on ${resource}`);
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private resolvePolicy(resource: string): AbacPolicy {
    return {
      evaluate: () => true,
    };
  }
}
