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
export class Attendance extends Model<Attendance> {
  @ForeignKey(() => Employee)
  @Column({ type: DataType.INTEGER })
  employeeId: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare entry: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare leave: string;

  @BelongsTo(() => Employee, { foreignKey: 'employeeId' })
  employee: Employee;
}
