import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SchedulesService } from '../services/schedules.service';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleFilterDto } from '../dto/schedule-filter.dto';
import {
  ScheduleResponseDto,
  SlotGroupDto,
} from '../dto/slot-response.dto';
import { ValidationPipe } from '../../../common/pipes/validation.pipe';

@ApiTags('schedules')
@Controller('schedules')
@UsePipes(new ValidationPipe())
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create or update a staff schedule',
    description: 'Creates a new schedule or updates an existing one for a staff member on a specific date',
  })
  @ApiBody({ type: CreateScheduleDto })
  @ApiResponse({
    status: 201,
    description: 'Schedule created successfully',
    type: ScheduleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - schedule already exists',
  })
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    return await this.schedulesService.create(createScheduleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve schedules',
    description: 'Get all schedules with optional filtering by staffId, date, and active status',
  })
  @ApiQuery({
    name: 'staffId',
    required: false,
    description: 'Filter by staff member ID',
    example: 'STAFF001',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by specific date (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Schedules retrieved successfully',
    type: [ScheduleResponseDto],
  })
  async findAll(@Query() filterDto: ScheduleFilterDto) {
    return await this.schedulesService.findAll(filterDto);
  }

  @Get(':date/slots')
  @ApiOperation({
    summary: 'Generate time slots for a specific date',
    description: 'Returns time slots grouped by date based on the given interval in minutes',
  })
  @ApiParam({
    name: 'date',
    description: 'Date for slot generation (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @ApiQuery({
    name: 'interval',
    required: true,
    description: 'Time interval in minutes (1-1440)',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Time slots generated successfully',
    type: [SlotGroupDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid date or interval',
  })
  async generateSlots(
    @Param('date') date: string,
    @Query('interval') interval: number,
  ) {
    return await this.schedulesService.generateSlots(date, Number(interval));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific schedule',
    description: 'Retrieve a schedule by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Schedule ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Schedule retrieved successfully',
    type: ScheduleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found',
  })
  async findOne(@Param('id') id: string) {
    return await this.schedulesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a schedule',
    description: 'Update an existing schedule by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Schedule ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateScheduleDto })
  @ApiResponse({
    status: 200,
    description: 'Schedule updated successfully',
    type: ScheduleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return await this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a schedule',
    description: 'Delete a schedule by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Schedule ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 204,
    description: 'Schedule deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found',
  })
  async remove(@Param('id') id: string) {
    return await this.schedulesService.remove(id);
  }
}