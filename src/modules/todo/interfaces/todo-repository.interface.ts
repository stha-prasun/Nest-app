import type { Todo } from '../entities/todo.entity';

export interface ITodoRepository {
  create(data: Todo): Promise<Todo>;
  findById(id: string): Promise<Todo | null>;
  findAllByUserId(userId: string): Promise<Todo[]>;
  update(
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: string;
      isCompleted?: boolean;
      dueDate?: Date;
    },
  ): Promise<Todo>;
  delete(id: string): Promise<void>;
}
