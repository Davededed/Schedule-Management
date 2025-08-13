export interface Schedule {
  _id?: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  interval: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateScheduleRequest {
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  interval: number;
  isActive?: boolean;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {}

export interface ScheduleFilter {
  staffId?: string;
  date?: string;
  isActive?: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  staffId?: string;
}

export interface SlotGroup {
  date: string;
  slots: TimeSlot[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | object;
}