import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TodoFactory } from './factories/todo.factory';
import { TODO_REPOSITORY } from './constants/todo.constants';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        TodoFactory,
        {
          provide: TODO_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAllByUserId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
