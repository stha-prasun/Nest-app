import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoFactory } from './factories/todo.factory';
import { PrismaTodoRepository } from './repositories/prisma-todo.repository';
import { TODO_REPOSITORY } from './constants/todo.constants';

@Module({
  controllers: [TodoController],
  providers: [
    TodoService,
    TodoFactory,
    {
      provide: TODO_REPOSITORY,
      useClass: PrismaTodoRepository,
    },
  ],
})
export class TodoModule {}
