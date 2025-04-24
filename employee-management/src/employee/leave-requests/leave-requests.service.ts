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

  async create(createDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    return this.leaveRequestModel.create(createDto as any);
  }

  async approve(
    id: number,
    dto: ApproveLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);

    console.log('leaveRequest');
    console.log(leaveRequest);

    await leaveRequest.update({
      status: dto.status,
      approverId: dto.approverId,
      approverNotes: dto.approverNotes,
      approvalDate: new Date(),
    });

    return leaveRequest;
  }

  async update(
    id: number,
    updateDto: UpdateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);

    if (leaveRequest.status !== 'pending') {
      throw new Error('Cannot update processed leave request');
    }

    await leaveRequest.update(updateDto);
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
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
        ],
      },
    });

    let totalDays = 0;

    leaveRequests.forEach((leave) => {
      const start = leave.startDate < startDate ? startDate : leave.startDate;
      const end = leave.endDate > endDate ? endDate : leave.endDate;

      const diffTime = Math.abs(end.getTime() - start.getTime());
      totalDays += Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    });

    return totalDays;
  }

  async remove(id: number): Promise<void> {
    const leaveRequest = await this.findOne(id);

    if (leaveRequest.status !== 'pending') {
      throw new Error('Cannot delete processed leave request');
    }
    await leaveRequest.destroy();
  }
}
