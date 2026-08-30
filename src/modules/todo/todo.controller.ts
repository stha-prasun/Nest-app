import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { AbacGuard } from '@common/guards/abac.guard';
import { Abac } from '@common/guards/abac.decorator';
import { TODO_RESOURCE, TodoActions } from './constants/todo.constants';

interface AuthenticatedRequest {
  user: { userId: string; email: string };
}

@ApiTags('Todos')
@Controller('todo')
@UseGuards(JwtAuthGuard, AbacGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Abac(TODO_RESOURCE, TodoActions.CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created' })
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todoService.create(req.user.userId, createTodoDto);
  }

  @Get()
  @Abac(TODO_RESOURCE, TodoActions.READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all todos for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of todos' })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.todoService.findAllByUserId(req.user.userId);
  }

  @Get(':id')
  @Abac(TODO_RESOURCE, TodoActions.READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiResponse({ status: 200, description: 'Todo found' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.todoService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @Abac(TODO_RESOURCE, TodoActions.UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, req.user.userId, updateTodoDto);
  }

  @Delete(':id')
  @Abac(TODO_RESOURCE, TodoActions.DELETE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 200, description: 'Todo deleted' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.todoService.remove(id, req.user.userId);
  }
}
