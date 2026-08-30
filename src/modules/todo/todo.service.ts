import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ITodoRepository } from './interfaces/todo-repository.interface';
import { TodoFactory } from './factories/todo.factory';
import { TODO_REPOSITORY } from './constants/todo.constants';

@Injectable()
export class TodoService {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: ITodoRepository,
    private readonly todoFactory: TodoFactory,
  ) {}

  async create(userId: string, dto: CreateTodoDto) {
    const todo = this.todoFactory.create(dto, userId);

    return this.todoRepository.create(todo);
  }

  async findAllByUserId(userId: string) {
    return this.todoRepository.findAllByUserId(userId);
  }

  async findOne(id: string, userId: string) {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You do not have access to this todo');
    }

    return todo;
  }

  async update(id: string, userId: string, dto: UpdateTodoDto) {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You do not have access to this todo');
    }

    return this.todoRepository.update(id, {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      isCompleted: dto.isCompleted,
      dueDate: dto.dueDate,
    });
  }

  async remove(id: string, userId: string) {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You do not have access to this todo');
    }

    await this.todoRepository.delete(id);
  }
}
