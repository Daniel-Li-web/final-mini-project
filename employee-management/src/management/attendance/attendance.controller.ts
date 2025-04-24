import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // 新增考勤记录
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  // 获取全部考勤记录
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  // 获取某员工的全部考勤记录
  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.attendanceService.findByEmployee(Number(employeeId));
  }

  // 获取某员工在时间范围内的考勤记录（推荐使用 Query 方式）
  @Get('range')
  findByDateRange(
    @Query('employeeId') employeeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.findByDateRange(
      Number(employeeId),
      new Date(startDate),
      new Date(endDate),
    );
  }

  // 获取单条考勤记录
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(Number(id));
  }

  // 修改某条考勤记录
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(Number(id), updateAttendanceDto);
  }

  // 删除某条记录
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(Number(id));
  }

  // 获取某员工某月的出勤统计（前端图表和 summary 数据）
  @Get('monthly-summary')
  getMonthlySummary(
    @Query('employeeId') employeeId: string,
    @Query('month') month: string, // e.g. "2025-04"
  ) {
    return this.attendanceService.getMonthlySummary(employeeId, month);
  }
}
