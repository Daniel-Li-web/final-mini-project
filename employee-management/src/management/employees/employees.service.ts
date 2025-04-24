import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { Op } from 'sequelize';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee)
    private employeeModel: typeof Employee,
  ) {}

  // 1. Employee information inputting
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeModel.create(createEmployeeDto as any);
  }

  // 2. Employee information editing
  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    await employee.update(updateEmployeeDto);
    return employee;
  }

  // 6. Employee information viewing
  async findAll(filter?: FilterEmployeeDto): Promise<Employee[]> {
    const where: any = {};
    
    if (filter) {
      if (filter.name) {
        where.name = { [Op.iLike]: `%${filter.name}%` };
      }
      
      if (filter.department) {
        where.department = filter.department;
      }
      
      if (filter.position) {
        where.position = filter.position;
      }
    }
    
    return this.employeeModel.findAll({ where });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeModel.findByPk(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async findByManager(managerId: number): Promise<Employee[]> {
    return this.employeeModel.findAll({
      where: { managerId },
    });
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await employee.destroy();
  }
}
