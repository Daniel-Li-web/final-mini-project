import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './employee/employees/employees.module';
import { AttendanceModule } from './employee/attendance/attendance.module';
import { LeaveRequestsModule } from './employee/leave-requests/leave-requests.module';
import { SalariesModule } from './employee/salaries/salaries.module';
import { AuthModule } from './auth/auth.module'; // Import AuthModule here

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make environment variables globally available
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '6730613044',
      database: process.env.DB_DATABASE || 'employee',
      autoLoadModels: true,
      synchronize: true, // Set to false in production
    }),
    AuthModule, // Include the AuthModule
    EmployeesModule,
    AttendanceModule,
    LeaveRequestsModule,
    SalariesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
