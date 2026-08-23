import { applyDecorators, SetMetadata } from '@nestjs/common';

export const ABAC_RESOURCE_KEY = 'abac_resource';
export const ABAC_ACTION_KEY = 'abac_action';

export function Abac(resource: string, action: string) {
  return applyDecorators(
    SetMetadata(ABAC_RESOURCE_KEY, resource),
    SetMetadata(ABAC_ACTION_KEY, action),
  );
}
