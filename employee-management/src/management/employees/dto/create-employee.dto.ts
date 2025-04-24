// src/employees/dto/create-employee.dto.ts
import { IsBoolean, IsDate, IsDecimal, IsEmail, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
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

  @IsOptional()
  @IsBoolean()
  isManager?: boolean;

  @IsOptional()
  @IsInt()
  managerId?: number;

  @IsNotEmpty()
  @IsDecimal()
  baseSalary: number;
}