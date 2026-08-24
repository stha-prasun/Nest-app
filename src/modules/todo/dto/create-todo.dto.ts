import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority } from '../constants/todo.constants';
import { Trim } from '@common/normalizers/trim.decorator';
import { ParseDate } from '@common/normalizers/parse-date.decorator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  title!: string;

  @ApiPropertyOptional({ example: 'Milk, eggs, bread' })
  @IsOptional()
  @IsString()
  @Trim()
  description?: string;

  @ApiProperty({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDate()
  @ParseDate()
  dueDate?: Date;
}
