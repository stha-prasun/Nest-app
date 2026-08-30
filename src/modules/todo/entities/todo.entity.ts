import { Priority } from '../constants/todo.constants';

export class Todo {
  id!: string;
  title!: string;
  description!: string | null;
  isCompleted!: boolean;
  priority!: Priority;

  createdAt!: Date;
  updatedAt!: Date;

  dueDate!: Date | null;

  userId!: string;
}
