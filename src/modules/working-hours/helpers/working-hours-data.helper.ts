import type { IStaffWorkingHours, IMonthWorkingHours, IDayWorkingHours, ITimeSlot } from '../interfaces';

/**
 * @description Helper functions for working with working hours data
 */
export class WorkingHoursDataHelper {
  /**
   * @description Get working hours for a specific staff member, year, and month
   */
  static getMonthWorkingHours(
    staffData: IStaffWorkingHours,
    year: number,
    month: number,
  ): IMonthWorkingHours | null {
    return staffData.monthlyData.find(monthData => monthData.year === year && monthData.month === month) || null;
  }

  /**
   * @description Get working hours for a specific day
   */
  static getDayWorkingHours(monthData: IMonthWorkingHours, day: number): IDayWorkingHours | null {
    return monthData.workingHours.find(dayData => dayData.day === day) || null;
  }

  /**
   * @description Check if a staff member has working hours on a specific date
   */
  static hasWorkingHours(staffData: IStaffWorkingHours, year: number, month: number, day: number): boolean {
    const monthData = this.getMonthWorkingHours(staffData, year, month);
    if (!monthData) return false;

    const dayData = this.getDayWorkingHours(monthData, day);
    return dayData ? dayData.timeSlots.length > 0 : false;
  }

  /**
   * @description Get formatted time slots for display
   */
  static getFormattedTimeSlots(staffData: IStaffWorkingHours, year: number, month: number, day: number): string {
    const monthData = this.getMonthWorkingHours(staffData, year, month);
    if (!monthData) return '';

    const dayData = this.getDayWorkingHours(monthData, day);
    if (!dayData || dayData.timeSlots.length === 0) return '';

    return dayData.timeSlots.map(slot => `${slot.startTime}-${slot.endTime}`).join('\n');
  }

  /**
   * @description Add or update working hours for a specific day
   */
  static setDayWorkingHours(
    staffData: IStaffWorkingHours,
    year: number,
    month: number,
    day: number,
    timeSlots: ITimeSlot[],
  ): void {
    // Find or create month data
    let monthData = this.getMonthWorkingHours(staffData, year, month);
    if (!monthData) {
      monthData = {
        year,
        month,
        workingHours: [],
      };
      staffData.monthlyData.push(monthData);
    }

    // Find or create day data
    let dayData = this.getDayWorkingHours(monthData, day);
    if (!dayData) {
      dayData = {
        day,
        timeSlots: [],
      };
      monthData.workingHours.push(dayData);
      // Sort by day
      monthData.workingHours.sort((a, b) => a.day - b.day);
    }

    // Update time slots
    dayData.timeSlots = timeSlots;
  }

  /**
   * @description Add a time slot to a specific day
   */
  static addTimeSlot(
    staffData: IStaffWorkingHours,
    year: number,
    month: number,
    day: number,
    timeSlot: ITimeSlot,
  ): void {
    const monthData = this.getMonthWorkingHours(staffData, year, month);
    if (!monthData) {
      this.setDayWorkingHours(staffData, year, month, day, [timeSlot]);
      return;
    }

    const dayData = this.getDayWorkingHours(monthData, day);
    if (!dayData) {
      this.setDayWorkingHours(staffData, year, month, day, [timeSlot]);
      return;
    }

    dayData.timeSlots.push(timeSlot);
  }

  /**
   * @description Remove a time slot from a specific day
   */
  static removeTimeSlot(
    staffData: IStaffWorkingHours,
    year: number,
    month: number,
    day: number,
    timeSlotId: string,
  ): void {
    const monthData = this.getMonthWorkingHours(staffData, year, month);
    if (!monthData) return;

    const dayData = this.getDayWorkingHours(monthData, day);
    if (!dayData) return;

    dayData.timeSlots = dayData.timeSlots.filter(slot => slot.id !== timeSlotId);
  }

  /**
   * @description Generate a unique ID for time slots
   */
  static generateTimeSlotId(): string {
    return `timeslot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
