# Working Hours Data Structure - New Implementation

## Overview

The working hours system has been refactored to use a more scalable and maintainable data structure that can handle multiple months, years, and complex time slot management.

## New Data Structure

### Core Interfaces

1. **ITimeSlot** - Represents a single work shift

```typescript
interface ITimeSlot {
  id: string;
  startTime: string; // Format: "HH:mm" (e.g., "09:00")
  endTime: string; // Format: "HH:mm" (e.g., "17:00")
}
```

2. **IDayWorkingHours** - Represents all shifts for a specific day

```typescript
interface IDayWorkingHours {
  day: number; // 1-31 (day of the month)
  timeSlots: ITimeSlot[];
}
```

3. **IMonthWorkingHours** - Represents all working hours for a month

```typescript
interface IMonthWorkingHours {
  year: number; // e.g., 2025
  month: number; // 1-12 (January = 1)
  workingHours: IDayWorkingHours[];
}
```

4. **IStaffWorkingHours** - Represents all working hours for a staff member

```typescript
interface IStaffWorkingHours {
  id: number;
  staff: string;
  monthlyData: IMonthWorkingHours[];
}
```

## Key Benefits

### 1. **Scalability**

- Can store working hours for any month/year
- No fixed property names limiting the date range
- Easy to query historical data

### 2. **Flexibility**

- Multiple time slots per day
- Different time slots for different staff members
- Easy to add/remove shifts dynamically

### 3. **Maintainability**

- Clear separation of concerns
- Type-safe operations
- Helper functions for common operations

### 4. **Data Integrity**

- Each time slot has a unique ID
- Proper date validation
- No duplicate or conflicting data

## Helper Functions

The `WorkingHoursDataHelper` class provides utility methods:

- `getMonthWorkingHours()` - Get working hours for a specific month
- `getDayWorkingHours()` - Get working hours for a specific day
- `hasWorkingHours()` - Check if staff has working hours on a date
- `getFormattedTimeSlots()` - Get formatted time slots for display
- `addTimeSlot()` - Add a new time slot
- `removeTimeSlot()` - Remove a time slot
- `generateTimeSlotId()` - Generate unique IDs

## Example Usage

### Sample Data Structure

```typescript
{
  id: 1,
  staff: 'Bessie Cooper #001',
  monthlyData: [
    {
      year: 2025,
      month: 8, // August
      workingHours: [
        {
          day: 1,
          timeSlots: [
            { id: 'ts1', startTime: '07:00', endTime: '12:00' },
            { id: 'ts2', startTime: '18:00', endTime: '23:00' }
          ]
        },
        {
          day: 3,
          timeSlots: [
            { id: 'ts3', startTime: '09:00', endTime: '17:00' }
          ]
        }
        // ... more days
      ]
    }
    // ... more months
  ]
}
```

### Adding a Time Slot

```typescript
// Add a new shift for staff ID 1 on August 5, 2025
workingHoursList_addTimeSlot(1, 2025, 8, 5, '09:00', '17:00');
```

### Checking Working Hours

```typescript
// Check if staff has working hours on a specific date
const hasHours = WorkingHoursDataHelper.hasWorkingHours(staffData, 2025, 8, 5);
```

## UI Integration

### Month View

- Shows "Present" if the day has any time slots
- Shows "Absent" if the day has no time slots
- Still uses the familiar Present/Absent indicators

### Week View

- Shows actual time slots (e.g., "07:00-12:00\n18:00-23:00")
- Displays multiple shifts on separate lines
- Each day shows real working hours

### Dynamic Table Generation

The table data is now computed dynamically based on:

- Selected month/year
- View type (Month/Week)
- Actual working hours data

## Migration Benefits

1. **Backward Compatibility**: The UI still works the same way
2. **Future-Proof**: Can easily extend to support more features
3. **Performance**: Only loads data for the selected time period
4. **Real-Time Updates**: Changes reflect immediately in the UI
5. **Data Validation**: Type safety prevents invalid data entry

## Future Enhancements

This new structure makes it easy to add:

- Break times within shifts
- Different shift types (regular, overtime, holiday)
- Recurring shift patterns
- Shift templates
- Time tracking and reporting
- Export/import functionality
- Multi-location support

The refactored system provides a solid foundation for any working hours management requirements while maintaining clean, maintainable code.
