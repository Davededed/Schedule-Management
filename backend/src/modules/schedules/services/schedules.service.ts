import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from '../schemas/schedule.schema';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleFilterDto } from '../dto/schedule-filter.dto';
import {
  ISchedule,
  ITimeSlot,
  ISlotGroup,
} from '../interfaces/schedule.interface';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ISchedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<ISchedule> {
    try {
      // Validate time logic
      this.validateTimeRange(createScheduleDto.startTime, createScheduleDto.endTime);

      // Check for existing schedule for the same staff and date
      const existingSchedule = await this.scheduleModel.findOne({
        staffId: createScheduleDto.staffId,
        date: new Date(createScheduleDto.date),
      });

      if (existingSchedule) {
        // Update existing schedule
        Object.assign(existingSchedule, createScheduleDto);
        existingSchedule.date = new Date(createScheduleDto.date);
        return await existingSchedule.save();
      }

      // Create new schedule
      const schedule = new this.scheduleModel({
        ...createScheduleDto,
        date: new Date(createScheduleDto.date),
      });

      const savedSchedule = await schedule.save();
      this.logger.log(`Schedule created for staff ${createScheduleDto.staffId} on ${createScheduleDto.date}`);
      
      return savedSchedule;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Schedule already exists for this staff member on this date');
      }
      throw error;
    }
  }

  async findAll(filterDto: ScheduleFilterDto): Promise<ISchedule[]> {
    const filter: any = {};

    if (filterDto.staffId) {
      filter.staffId = filterDto.staffId;
    }

    if (filterDto.date) {
      filter.date = new Date(filterDto.date);
    }

    if (filterDto.isActive !== undefined) {
      filter.isActive = filterDto.isActive;
    }

    const schedules = await this.scheduleModel
      .find(filter)
      .sort({ date: 1, staffId: 1 })
      .exec();

    this.logger.log(`Found ${schedules.length} schedules with filters: ${JSON.stringify(filter)}`);
    return schedules;
  }

  async findOne(id: string): Promise<ISchedule> {
    const schedule = await this.scheduleModel.findById(id).exec();
    
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<ISchedule> {
    if (updateScheduleDto.startTime && updateScheduleDto.endTime) {
      this.validateTimeRange(updateScheduleDto.startTime, updateScheduleDto.endTime);
    }

    const updateData: any = { ...updateScheduleDto };
    if (updateScheduleDto.date) {
      updateData.date = new Date(updateScheduleDto.date);
    }

    const schedule = await this.scheduleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    this.logger.log(`Schedule ${id} updated`);
    return schedule;
  }

  async remove(id: string): Promise<void> {
    const result = await this.scheduleModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    this.logger.log(`Schedule ${id} deleted`);
  }

  async generateSlots(date: string, interval: number): Promise<ISlotGroup[]> {
    if (!date) {
      throw new BadRequestException('Date is required');
    }

    if (!interval || interval < 1 || interval > 1440) {
      throw new BadRequestException('Interval must be between 1 and 1440 minutes');
    }

    const targetDate = new Date(date);
    
    // Find all active schedules for the given date
    const schedules = await this.scheduleModel
      .find({
        date: targetDate,
        isActive: true,
      })
      .exec();

    if (schedules.length === 0) {
      return [{
        date,
        slots: [],
      }];
    }

    // Generate slots for each schedule and merge them
    const allSlots: ITimeSlot[] = [];

    for (const schedule of schedules) {
      const scheduleSlots = this.generateSlotsForSchedule(
        schedule.startTime,
        schedule.endTime,
        interval,
        schedule.staffId,
      );
      allSlots.push(...scheduleSlots);
    }

    // Remove duplicates and sort by start time
    const uniqueSlots = this.removeDuplicateSlots(allSlots);
    uniqueSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    this.logger.log(`Generated ${uniqueSlots.length} slots for date ${date} with ${interval}min interval`);

    return [{
      date,
      slots: uniqueSlots,
    }];
  }

  private generateSlotsForSchedule(
    startTime: string,
    endTime: string,
    interval: number,
    staffId: string,
  ): ITimeSlot[] {
    const slots: ITimeSlot[] = [];
    
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    for (let current = start; current < end; current += interval) {
      const slotEnd = Math.min(current + interval, end);
      
      slots.push({
        startTime: this.minutesToTime(current),
        endTime: this.minutesToTime(slotEnd),
        isAvailable: true,
        staffId,
      });
    }

    return slots;
  }

  private removeDuplicateSlots(slots: ITimeSlot[]): ITimeSlot[] {
    const slotMap = new Map<string, ITimeSlot>();

    for (const slot of slots) {
      const key = `${slot.startTime}-${slot.endTime}`;
      
      if (!slotMap.has(key)) {
        slotMap.set(key, slot);
      } else {
        // If duplicate time slot exists, mark as unavailable (conflict)
        const existingSlot = slotMap.get(key)!;
        existingSlot.isAvailable = false;
        existingSlot.staffId = undefined; // Remove staff assignment due to conflict
      }
    }

    return Array.from(slotMap.values());
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (end - start > 1440) {
      throw new BadRequestException('Schedule duration cannot exceed 24 hours');
    }
  }
}