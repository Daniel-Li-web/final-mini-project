import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SalariesService } from './salaries.service';
import { SalariesController } from './salaries.controller';
import { Salary } from './entities/salary.entity';
import { EmployeesModule } from '../employees/employees.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeaveRequestsModule } from '../leave-requests/leave-requests.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Salary]),
    EmployeesModule,
    AttendanceModule,
    LeaveRequestsModule,
  ],
  controllers: [SalariesController],
  providers: [SalariesService],
})
export class SalariesModule {}