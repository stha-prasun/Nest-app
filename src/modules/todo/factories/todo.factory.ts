import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Todo } from '../entities/todo.entity';
import { Priority } from '../constants/todo.constants';
import { CreateTodoDto } from '../dto/create-todo.dto';

@Injectable()
export class TodoFactory {
  create(dto: CreateTodoDto, userId: string): Todo {
    const todo = new Todo();

    todo.id = randomUUID();
    todo.title = dto.title;
    todo.description = dto.description ?? null;
    todo.isCompleted = false;
    todo.priority = dto.priority ?? Priority.MEDIUM;
    todo.createdAt = new Date();
    todo.updatedAt = new Date();
    todo.dueDate = dto.dueDate ?? null;
    todo.userId = userId;

    return todo;
  }
}
