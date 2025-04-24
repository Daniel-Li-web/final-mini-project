import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveLeaveRequestDto {
  @IsNotEmpty()
  @IsInt()
  approverId: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['approved', 'rejected'])
  status: string;

  @IsOptional()
  @IsString()
  approverNotes?: string;
}