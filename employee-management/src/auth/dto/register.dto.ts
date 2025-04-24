// src/auth/dto/register.dto.ts
import { IsEnum, IsString } from 'class-validator';

export class RegisterDto {
  @IsString() id: string;
  @IsString() password: string;
  @IsEnum(['manager', 'employee']) role: 'manager' | 'employee';
  @IsString() name: string;
  @IsString() email: string;
  @IsString() phone: string;
}
