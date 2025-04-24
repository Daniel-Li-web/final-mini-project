import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Salary } from './entities/salary.entity';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { CalculateSalaryDto } from './dto/calculate-salary.dto';
import { EmployeesService } from '../employees/employees.service';
import { AttendanceService } from '../attendance/attendance.service';
import { LeaveRequestsService } from '../leave-requests/leave-requests.service';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class SalariesService {
  constructor(
    @InjectModel(Salary)
    private salaryModel: typeof Salary,
    private employeesService: EmployeesService,
    private attendanceService: AttendanceService,
    private leaveRequestsService: LeaveRequestsService,
  ) {}

  // 5. Employee salary calculator
  async calculate(calculateSalaryDto: CalculateSalaryDto): Promise<Salary> {
    const { employeeId, month } = calculateSalaryDto;
    
    // Get employee details
    const employee = await this.employeesService.findOne(employeeId);
    
    // Get attendance data
    const daysWorked = await this.attendanceService.countWorkingDays(employeeId, month);
    
    // Get leave data
    const leavesTaken = await this.leaveRequestsService.countLeaveDays(employeeId, month);
    
    // Calculate work days in month
    const totalDaysInMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0,
    ).getDate();
    const workingDaysEstimate = Math.min(22, totalDaysInMonth); // Assuming max 22 working days per month
    
    // Basic calculation
    const baseSalary = employee.baseSalary;
    const perDaySalary = baseSalary / workingDaysEstimate;
    
    // Calculate deductions for unpaid leaves (if any)
    // For this example, we'll assume all approved leaves are paid
    const deductions = 0;
    
    // Calculate net salary
    const netSalary = baseSalary - deductions;
    
    // Create salary record
    const salaryData: CreateSalaryDto = {
      employeeId,
      month,
      baseSalary,
      // daysWorked,
      leavesTaken,
      deductions,
      netSalary,
      status: 'pending',
    };
    
    return this.create(salaryData);
  }

  async create(createSalaryDto: CreateSalaryDto): Promise<Salary> {
    // Calculate net salary if not provided
    if (!createSalaryDto.netSalary) {
      const deductions = createSalaryDto.deductions || 0;
      const bonus = createSalaryDto.bonus || 0;
      const overtime = createSalaryDto.overtime || 0;
      
      createSalaryDto.netSalary = 
        createSalaryDto.baseSalary + bonus + overtime - deductions;
    }
    
    return this.salaryModel.create(createSalaryDto as any);
  }

  async update(id: number, updateSalaryDto: UpdateSalaryDto): Promise<Salary> {
    const salary = await this.findOne(id);
    
    // Recalculate net salary if components changed
    if (updateSalaryDto.baseSalary || updateSalaryDto.deductions || 
        updateSalaryDto.bonus || updateSalaryDto.overtime) {
      
      const baseSalary = updateSalaryDto.baseSalary || salary.baseSalary;
      const deductions = updateSalaryDto.deductions !== undefined ? updateSalaryDto.deductions : salary.deductions;
      const bonus = updateSalaryDto.bonus !== undefined ? updateSalaryDto.bonus : salary.bonus;
      const overtime = updateSalaryDto.overtime !== undefined ? updateSalaryDto.overtime : salary.overtime;
      
      updateSalaryDto.netSalary = baseSalary + bonus + overtime - deductions;
    }
    
    await salary.update(updateSalaryDto);
    return salary;
  }

  async findAll(): Promise<Salary[]> {
    return this.salaryModel.findAll({
      include: [Employee],
    });
  }

  async findByEmployee(employeeId: number): Promise<Salary[]> {
    return this.salaryModel.findAll({
      where: { employeeId },
      include: [Employee],
    });
  }

  async findOne(id: number): Promise<Salary> {
    const salary = await this.salaryModel.findByPk(id, {
      include: [Employee],
    });
    if (!salary) {
      throw new NotFoundException(`Salary with ID ${id} not found`);
    }
    return salary;
  }

  async remove(id: number): Promise<void> {
    const salary = await this.findOne(id);
    await salary.destroy();
  }
}