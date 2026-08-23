import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NormalizeEmail } from '../../../common/normalizers/normalize-email.decorator.js';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Registered email address',
  })
  @IsEmail()
  @IsNotEmpty()
  @NormalizeEmail()
  email!: string;

  @ApiProperty({ example: 'securePass123', description: 'Account password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
