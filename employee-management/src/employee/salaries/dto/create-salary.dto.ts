import { IsDate, IsDecimal, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSalaryDto {
  @IsNotEmpty()
  @IsInt()
  employeeId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  month: Date;

  @IsNotEmpty()
  @IsDecimal()
  baseSalary: number;

  @IsOptional()
  @IsDecimal()
  overtime?: number;

  @IsOptional()
  @IsDecimal()
  bonus?: number;

  @IsOptional()
  @IsDecimal()
  deductions?: number;

  @IsOptional()
  @IsInt()
  leavesTaken?: number;

  @IsOptional()
  @IsInt()
  daysWorked?: number;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'processed', 'paid'])
  status?: string;
  
  @IsOptional()
  @IsDecimal()
  netSalary?: number;
}