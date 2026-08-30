import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABAC_ACTION_KEY, ABAC_RESOURCE_KEY } from './abac.decorator';
import type { AbacContext, AbacPolicy } from './abac.interface';
import { PrismaService } from '../../modules/prisma/prisma.service';

interface RequestUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest {
  user?: RequestUser;
  params?: Record<string, string>;
}

@Injectable()
export class AbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    const policy = await this.resolvePolicy(resource, request.params?.id);
    if (!policy.evaluate(abacContext)) {
      throw new ForbiddenException(`Access denied: ${action} on ${resource}`);
    }

    return true;
  }

  private async resolvePolicy(
    resource: string,
    resourceId?: string,
  ): Promise<AbacPolicy> {
    if (resource === 'todo' && resourceId) {
      const todo = await this.prisma.todo.findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });

      return {
        evaluate: (ctx: AbacContext) => {
          return todo?.userId === ctx.subject.userId;
        },
      };
    }

    return {
      evaluate: () => true,
    };
  }
}
