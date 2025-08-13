import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class ScheduleFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by staff member identifier',
    example: 'STAFF001',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  staffId?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific date in ISO format',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}