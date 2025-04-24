import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LeaveRequest } from './entities/leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { ApproveLeaveRequestDto } from './dto/approve-leave-request.dto';
import { Employee } from '../employees/entities/employee.entity';
import { Op } from 'sequelize';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectModel(LeaveRequest)
    private leaveRequestModel: typeof LeaveRequest,
  ) {}

  // 3. Leave management
  async create(createLeaveRequestDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    return this.leaveRequestModel.create(createLeaveRequestDto as any);
  }

  // 4. Manager leave approval
  async approve(id: number, approveLeaveRequestDto: ApproveLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);
    
    await leaveRequest.update({
      status: approveLeaveRequestDto.status,
      approverId: approveLeaveRequestDto.approverId,
      approverNotes: approveLeaveRequestDto.approverNotes,
      approvalDate: new Date(),
    });
    
    return leaveRequest;
  }

  async update(id: number, updateLeaveRequestDto: UpdateLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);
    
    // Only allow updates if status is still pending
    if (leaveRequest.status !== 'pending') {
      throw new Error('Cannot update leave request that has already been processed');
    }
    
    await leaveRequest.update(updateLeaveRequestDto);
    return leaveRequest;
  }

  async findAll(): Promise<LeaveRequest[]> {
    return this.leaveRequestModel.findAll({
      include: [
        { model: Employee, as: 'employee' },
        { model: Employee, as: 'approver' },
      ],
    });
  }

  async findByEmployee(employeeId: number): Promise<LeaveRequest[]> {
    return this.leaveRequestModel.findAll({
      where: { employeeId },
      include: [
        { model: Employee, as: 'employee' },
        { model: Employee, as: 'approver' },
      ],
    });
  }

  async findPendingByManager(managerId: number): Promise<LeaveRequest[]> {
    return this.leaveRequestModel.findAll({
      include: [
        {
          model: Employee,
          as: 'employee',
          where: { managerId },
        },
        { model: Employee, as: 'approver' },
      ],
      where: { status: 'pending' },
    });
  }

  async findOne(id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestModel.findByPk(id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: Employee, as: 'approver' },
      ],
    });
    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }
    return leaveRequest;
  }

  async countLeaveDays(employeeId: number, month: Date): Promise<number> {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const leaveRequests = await this.leaveRequestModel.findAll({
      where: {
        employeeId,
        status: 'approved',
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        ],
      },
    });
    
    let leaveDays = 0;
    
    leaveRequests.forEach(leave => {
      const effectiveStartDate = leave.startDate < startDate ? startDate : leave.startDate;
      const effectiveEndDate = leave.endDate > endDate ? endDate : leave.endDate;
      
      // Calculate days between the two dates (inclusive)
      const diffTime = Math.abs(effectiveEndDate.getTime() - effectiveStartDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      leaveDays += diffDays;
    });
    
    return leaveDays;
  }

  async remove(id: number): Promise<void> {
    const leaveRequest = await this.findOne(id);
    
    // Only allow deletion if status is still pending
    if (leaveRequest.status !== 'pending') {
      throw new Error('Cannot delete leave request that has already been processed');
    }
    
    await leaveRequest.destroy();
  }
}
