import { ApiProperty } from '@nestjs/swagger';

export class TimeSlotDto {
  @ApiProperty({
    description: 'Start time of the slot',
    example: '09:00',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the slot',
    example: '09:30',
  })
  endTime: string;

  @ApiProperty({
    description: 'Whether the slot is available',
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Staff member identifier if slot is assigned',
    example: 'STAFF001',
    required: false,
  })
  staffId?: string;
}

export class SlotGroupDto {
  @ApiProperty({
    description: 'Date for the slot group',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Array of time slots for the date',
    type: [TimeSlotDto],
  })
  slots: TimeSlotDto[];
}

export class ScheduleResponseDto {
  @ApiProperty({
    description: 'Schedule identifier',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'Staff member identifier',
    example: 'STAFF001',
  })
  staffId: string;

  @ApiProperty({
    description: 'Schedule date',
    example: '2024-01-15T00:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Start time',
    example: '09:00',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time',
    example: '17:00',
  })
  endTime: string;

  @ApiProperty({
    description: 'Time interval in minutes',
    example: 30,
  })
  interval: number;

  @ApiProperty({
    description: 'Whether the schedule is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:00:00.000Z',
  })
  updatedAt: Date;
}