// src/employees/entities/employee.entity.ts
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { LeaveRequest } from '../../leave-requests/entities/leave-request.entity';
import { Salary } from '../../salaries/entities/salary.entity';

@Table
export class Employee extends Model<Employee> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  position: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  department: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  joiningDate: Date;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.DATE,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isManager: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  managerId: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  baseSalary: number;

  @HasMany(() => Attendance)
  attendances: Attendance[];

  @HasMany(() => LeaveRequest)
  leaveRequests: LeaveRequest[];

  @HasMany(() => Salary)
  salaries: Salary[];
}