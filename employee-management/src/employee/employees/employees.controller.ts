/* eslint-disable prettier/prettier */
// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { EmployeesService } from './employees.service';
// import { CreateEmployeeDto } from './dto/create-employee.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';

// @Controller('employees')
// export class EmployeesController {
//   constructor(private readonly employeesService: EmployeesService) {}

//   @Post()
//   create(@Body() createEmployeeDto: CreateEmployeeDto) {
//     return this.employeesService.create(createEmployeeDto);
//   }

//   @Get()
//   findAll() {
//     return this.employeesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.employeesService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
//     return this.employeesService.update(+id, updateEmployeeDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.employeesService.remove(+id);
//   }
// }

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // 1. Employee information inputting
  @Post()
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  // 6. Employee information viewing
  @Get()
  findAll(@Query() filter: FilterEmployeeDto) {
    return this.employeesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Get('manager/:managerId')
  findByManager(@Param('managerId') managerId: string) {
    return this.employeesService.findByManager(+managerId);
  }

  // 2. Employee information editing
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}