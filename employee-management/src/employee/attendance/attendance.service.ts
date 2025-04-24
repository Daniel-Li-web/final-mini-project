/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Op, Optional } from 'sequelize';
import { Employee } from '../employees/entities/employee.entity';
import { NullishPropertiesOf } from 'sequelize/types/utils';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
    @InjectModel(Employee)
    private employeeModel: typeof Employee,
  ) {}

  // 创建考勤记录
  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Validate employeeId exists
    const employeeId = Number(createAttendanceDto.employeeId);
    if (isNaN(employeeId)) {
      throw new BadRequestException('Invalid employeeId: must be a number');
    }

    const employee = await this.employeeModel.findByPk(employeeId);
    if (!employee) {
      throw new BadRequestException(`Employee with ID ${employeeId} not found`);
    }

    const attendanceData = {
      employeeId: employeeId,
      date: createAttendanceDto.date,
      status: createAttendanceDto.status,
      entry: createAttendanceDto.entry || null,
      leave: createAttendanceDto.leave || null,
    };
    return this.attendanceModel.create(attendanceData as Optional<Attendance, NullishPropertiesOf<Attendance>>);
  }

  // 更新考勤记录
  async update(
    id: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const attendance = await this.findOne(id);

    // Convert employeeId to number if provided
    const updateData: any = { ...updateAttendanceDto };
    if (updateAttendanceDto.employeeId !== undefined) {
      const employeeId = Number(updateAttendanceDto.employeeId);
      if (isNaN(employeeId)) {
        throw new BadRequestException('Invalid employeeId: must be a number');
      }
      const employee = await this.employeeModel.findByPk(employeeId);
      if (!employee) {
        throw new BadRequestException(
          `Employee with ID ${employeeId} not found`,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.employeeId = employeeId;
    }

    await attendance.update(updateData);
    return attendance;
  }

  // 查询所有考勤记录
  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel.findAll();
  }

  // 查询指定员工的考勤记录
  async findByEmployee(employeeId: number): Promise<Attendance[]> {
    return this.attendanceModel.findAll({
      where: { employeeId },
      attributes: ['id', 'date', 'status', 'entry', 'leave'],
    });
  }

  // 查找单个考勤记录
  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceModel.findByPk(id, {
      attributes: ['id', 'date', 'status', 'entry', 'leave'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  // 删除考勤记录
  async remove(id: number): Promise<void> {
    const attendance = await this.findOne(id);
    await attendance.destroy();
  }

  // Placeholder methods (implement as needed)
  async findByDateRange(
    employeeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Attendance[]> {
    return this.attendanceModel.findAll({
      where: {
        employeeId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: ['id', 'date', 'status', 'entry', 'leave'],
    });
  }

  async countWorkingDays(employeeId: number, month: Date): Promise<number> {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const attendances = await this.attendanceModel.findAll({
      where: {
        employeeId,
        date: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.ne]: 'absent',
        },
      },
    });
    return attendances.length;
  }

  async getMonthlySummary(employeeId: string, month: string): Promise<any> {
    const employeeIdNum = Number(employeeId);
    if (isNaN(employeeIdNum)) {
      throw new BadRequestException('Invalid employeeId: must be a number');
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);
    const attendances = await this.findByDateRange(
      employeeIdNum,
      startDate,
      endDate,
    );
    return {
      totalDays: attendances.length,
      presentDays: attendances.filter(a => a.status === 'present').length,
      leaveDays: attendances.filter(a => a.status === 'leave').length,
    };
  }
}