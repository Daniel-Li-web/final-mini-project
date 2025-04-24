/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  employeeId: number;

  @IsDateString()
  date: string;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  entry?: string;

  @IsString()
  @IsOptional()
  leave?: string;
}

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
