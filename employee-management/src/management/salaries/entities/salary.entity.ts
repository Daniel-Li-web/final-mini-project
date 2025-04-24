import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Employee } from '../../employees/entities/employee.entity';

@Table
export class Salary extends Model<Salary> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  employeeId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  month: Date; // Store the first day of the month

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  baseSalary: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  overtime: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  bonus: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  deductions: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  leavesTaken: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  daysWorked: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  netSalary: number;

  @Column({
    type: DataType.STRING,
    defaultValue: 'pending',
  })
  status: string; // pending, processed, paid

  @BelongsTo(() => Employee)
  employee: Employee;
}