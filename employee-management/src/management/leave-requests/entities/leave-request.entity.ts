import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Employee } from '../../employees/entities/employee.entity';

@Table
export class LeaveRequest extends Model<LeaveRequest> {
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
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string; // sick, vacation, personal, other

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'pending',
  })
  status: string; // pending, approved, rejected

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  approverId: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  approvalDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  approverNotes: string;

  @BelongsTo(() => Employee)
  employee: Employee;

  @BelongsTo(() => Employee, { foreignKey: 'approverId' })
  approver: Employee;
}