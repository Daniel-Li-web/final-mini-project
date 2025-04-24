// src/attendance/dto/create-attendance.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsOptional()
  @IsString()
  entry?: string;

  @IsOptional()
  @IsString()
  leave?: string;
}
