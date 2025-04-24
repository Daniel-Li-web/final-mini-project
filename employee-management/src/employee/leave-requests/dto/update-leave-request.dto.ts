export class UpdateLeaveRequestDto {
  status: 'approved' | 'rejected';
  approverId: string;
  notes?: string;
}
