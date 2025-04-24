/* eslint-disable prettier/prettier */
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  position: string;

  @IsString()
  department: string;

  @Type(() => Date)
  @IsDate()
  joiningDate: Date;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @IsBoolean()
  isManager: boolean;

  @IsOptional()
  @IsNumber()
  managerId?: number;

  @IsNumber()
  baseSalary: number;
}
