export interface ITimeSlot {
  id: string;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
}

export interface IDayWorkingHours {
  day: number; // 1-31
  timeSlots: ITimeSlot[];
}

export interface IMonthWorkingHours {
  year: number;
  month: number; // 1-12
  workingHours: IDayWorkingHours[];
}

export interface IStaffWorkingHours {
  id: number;
  staff: string;
  monthlyData: IMonthWorkingHours[];
}

export interface IWorkingHoursData {
  staffMembers: IStaffWorkingHours[];
}
