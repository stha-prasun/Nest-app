import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { ITodoRepository } from '../interfaces/todo-repository.interface';
import type { Todo } from '../entities/todo.entity';
import { Priority } from '../constants/todo.constants';

@Injectable()
export class PrismaTodoRepository implements ITodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Todo): Promise<Todo> {
    const result = await this.prisma.todo.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        priority: data.priority ?? Priority.MEDIUM,
        dueDate: data.dueDate ?? null,
        userId: data.userId,
      },
    });

    return result as unknown as Todo;
  }

  async findById(id: string): Promise<Todo | null> {
    const result = await this.prisma.todo.findUnique({ where: { id } });
    return result as unknown as Todo | null;
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const results = await this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return results as unknown as Todo[];
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: string;
      isCompleted?: boolean;
      dueDate?: Date;
    },
  ): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    const result = await this.prisma.todo.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority ? (data.priority as Priority) : undefined,
        isCompleted: data.isCompleted,
        dueDate: data.dueDate,
      },
    });

    return result as unknown as Todo;
  }

  async delete(id: string): Promise<void> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    await this.prisma.todo.delete({ where: { id } });
  }
}
