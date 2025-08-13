import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  Max,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Staff member identifier',
    example: 'STAFF001',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  staffId: string;

  @ApiProperty({
    description: 'Schedule date in ISO format',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Start time in HH:MM format',
    example: '09:00',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format (24-hour)',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:MM format',
    example: '17:00',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format (24-hour)',
  })
  endTime: string;

  @ApiProperty({
    description: 'Time slot interval in minutes',
    example: 30,
    minimum: 1,
    maximum: 1440,
  })
  @IsNumber()
  @Min(1, { message: 'Interval must be at least 1 minute' })
  @Max(1440, { message: 'Interval cannot exceed 1440 minutes (24 hours)' })
  interval: number;

  @ApiProperty({
    description: 'Whether the schedule is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}