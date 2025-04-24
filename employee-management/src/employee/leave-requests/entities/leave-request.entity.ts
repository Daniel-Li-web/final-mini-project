import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
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
  @Column({ type: DataType.INTEGER, allowNull: false })
  employeeId: number;

  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  reason: string;

  @Column({ type: DataType.STRING, defaultValue: 'pending' })
  status: string;

  @ForeignKey(() => Employee)
  @Column({ type: DataType.INTEGER, allowNull: true })
  approverId: string;

  @Column({ type: DataType.DATE, allowNull: true })
  approvalDate: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  approverNotes: string;

  @BelongsTo(() => Employee, { as: 'employee', foreignKey: 'employeeId' })
  employee: Employee;

  @BelongsTo(() => Employee, { as: 'approver', foreignKey: 'approverId' })
  approver: Employee;
}
