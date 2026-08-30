export const TODO_REPOSITORY = Symbol('TODO_REPOSITORY');

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export const TODO_RESOURCE = 'todo';

export const TodoActions = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;
