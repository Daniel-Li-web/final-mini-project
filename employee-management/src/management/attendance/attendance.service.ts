// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { Attendance } from './entities/attendance.entity';
// import { CreateAttendanceDto } from './dto/create-attendance.dto';
// import { UpdateAttendanceDto } from './dto/update-attendance.dto';
// import { Op } from 'sequelize';
// import { Employee } from '../employees/entities/employee.entity';

// @Injectable()
// export class AttendanceService {
//   getMonthlySummary(employeeId: string, month: string) {
//     throw new Error('Method not implemented.');
//   }
//   constructor(
//     @InjectModel(Attendance)
//     private attendanceModel: typeof Attendance,
//   ) {}

//   // 3. Attendance management
//   async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
//     return this.attendanceModel.create(createAttendanceDto as any);
//   }

//   async update(
//     id: number,
//     updateAttendanceDto: UpdateAttendanceDto,
//   ): Promise<Attendance> {
//     const attendance = await this.findOne(id);
//     await attendance.update(updateAttendanceDto);
//     return attendance;
//   }

//   async findAll(): Promise<Attendance[]> {
//     return this.attendanceModel.findAll({
//       include: [Employee],
//     });
//   }

//   async findByEmployee(employeeId: number): Promise<Attendance[]> {
//     return this.attendanceModel.findAll({
//       where: { employeeId },
//       include: [Employee],
//     });
//   }

//   async findByDateRange(
//     employeeId: number,
//     startDate: Date,
//     endDate: Date,
//   ): Promise<Attendance[]> {
//     return this.attendanceModel.findAll({
//       where: {
//         employeeId:employeeId,
//         date: {
//           [Op.between]: [startDate, endDate],
//         },
//       },
//       include: [Employee],
//     });
//   }

//   async findOne(id: number): Promise<Attendance> {
//     const attendance = await this.attendanceModel.findByPk(id, {
//       include: [Employee],
//     });
//     if (!attendance) {
//       throw new NotFoundException(`Attendance with ID ${id} not found`);
//     }
//     return attendance;
//   }

//   async countWorkingDays(employeeId: number, month: Date): Promise<number> {
//     const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
//     const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
//     const attendances = await this.attendanceModel.findAll({
//       where: {
//         employeeId,
//         date: {
//           [Op.between]: [startDate, endDate],
//         },
//         status: {
//           [Op.ne]: 'absent',
//         },
//       },
//     });
//     return attendances.length;
//   }

//   async remove(id: number): Promise<void> {
//     const attendance = await this.findOne(id);
//     await attendance.destroy();
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Op } from 'sequelize';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class AttendanceService {
  findByDateRange(arg0: number, arg1: Date, arg2: Date) {
    throw new Error('Method not implemented.');
  }
  countWorkingDays(employeeId: number, month: Date) {
    throw new Error('Method not implemented.');
  }
  getMonthlySummary(employeeId: string, month: string) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
  ) {}

  // 创建考勤记录
  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    return this.attendanceModel.create(createAttendanceDto as any);
  }

  // 更新考勤记录
  async update(
    id: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const attendance = await this.findOne(id);
    await attendance.update(updateAttendanceDto);
    return attendance;
  }

  // 查询所有考勤记录（仅 id、leave、entry）
  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel.findAll();
  }
  

  // 查询指定员工的考勤记录（仅 id、leave、entry）
  async findByEmployee(employeeId: number): Promise<Attendance[]> {
    return this.attendanceModel.findAll({
      where: { employeeId },
      attributes: ['id', 'leave', 'entry'],
    });
  }

  // 按日期范围查询考勤（仅 id、leave、entry）
  // Removed duplicate implementation of the remove method
  

  // 查找单个考勤记录（仅 id、leave、entry）
  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceModel.findByPk(id, {
      attributes: ['id', 'leave', 'entry'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  // 统计某月的工作天数（status !== 'absent'）

  // 删除考勤记录
  async remove(id: number): Promise<void> {
    const attendance = await this.findOne(id);
    await attendance.destroy();
  }
}
