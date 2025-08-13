import { Document } from 'mongoose';

export interface ISchedule extends Document {
  staffId: string;
  date: Date;
  startTime: string;
  endTime: string;
  interval: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  staffId?: string;
}

export interface ISlotGroup {
  date: string;
  slots: ITimeSlot[];
}

export interface IScheduleFilter {
  staffId?: string;
  date?: string;
  isActive?: boolean;
}