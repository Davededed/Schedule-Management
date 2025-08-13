import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchedulesService } from './schedules.service';
import { Schedule } from '../schemas/schedule.schema';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { BadRequestException } from '@nestjs/common';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let model: Model<Schedule>;

  const mockSchedule = {
    _id: '507f1f77bcf86cd799439011',
    staffId: 'STAFF001',
    date: new Date('2024-01-15'),
    startTime: '09:00',
    endTime: '17:00',
    interval: 30,
    isActive: true,
    save: jest.fn(),
  };

  const mockScheduleModel = {
    new: jest.fn().mockResolvedValue(mockSchedule),
    constructor: jest.fn().mockResolvedValue(mockSchedule),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: getModelToken(Schedule.name),
          useValue: mockScheduleModel,
        },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
    model = module.get<Model<Schedule>>(getModelToken(Schedule.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSlotsForSchedule', () => {
    it('should generate correct time slots', () => {
      const slots = service['generateSlotsForSchedule']('09:00', '11:00', 30, 'STAFF001');
      
      expect(slots).toHaveLength(4);
      expect(slots[0]).toEqual({
        startTime: '09:00',
        endTime: '09:30',
        isAvailable: true,
        staffId: 'STAFF001',
      });
      expect(slots[3]).toEqual({
        startTime: '10:30',
        endTime: '11:00',
        isAvailable: true,
        staffId: 'STAFF001',
      });
    });

    it('should handle partial slots at the end', () => {
      const slots = service['generateSlotsForSchedule']('09:00', '10:45', 30, 'STAFF001');
      
      expect(slots).toHaveLength(4);
      expect(slots[3]).toEqual({
        startTime: '10:30',
        endTime: '10:45',
        isAvailable: true,
        staffId: 'STAFF001',
      });
    });
  });

  describe('timeToMinutes', () => {
    it('should convert time string to minutes correctly', () => {
      expect(service['timeToMinutes']('09:00')).toBe(540);
      expect(service['timeToMinutes']('12:30')).toBe(750);
      expect(service['timeToMinutes']('00:00')).toBe(0);
      expect(service['timeToMinutes']('23:59')).toBe(1439);
    });
  });

  describe('minutesToTime', () => {
    it('should convert minutes to time string correctly', () => {
      expect(service['minutesToTime'](540)).toBe('09:00');
      expect(service['minutesToTime'](750)).toBe('12:30');
      expect(service['minutesToTime'](0)).toBe('00:00');
      expect(service['minutesToTime'](1439)).toBe('23:59');
    });
  });

  describe('validateTimeRange', () => {
    it('should not throw for valid time range', () => {
      expect(() => service['validateTimeRange']('09:00', '17:00')).not.toThrow();
    });

    it('should throw BadRequestException for invalid time range', () => {
      expect(() => service['validateTimeRange']('17:00', '09:00')).toThrow(BadRequestException);
      expect(() => service['validateTimeRange']('09:00', '09:00')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for duration exceeding 24 hours', () => {
      expect(() => service['validateTimeRange']('09:00', '08:00')).toThrow(BadRequestException);
    });
  });

  describe('removeDuplicateSlots', () => {
    it('should remove duplicate slots and mark conflicts as unavailable', () => {
      const slots = [
        { startTime: '09:00', endTime: '09:30', isAvailable: true, staffId: 'STAFF001' },
        { startTime: '09:00', endTime: '09:30', isAvailable: true, staffId: 'STAFF002' },
        { startTime: '09:30', endTime: '10:00', isAvailable: true, staffId: 'STAFF001' },
      ];

      const result = service['removeDuplicateSlots'](slots);
      
      expect(result).toHaveLength(2);
      expect(result[0].isAvailable).toBe(false);
      expect(result[0].staffId).toBeUndefined();
      expect(result[1].isAvailable).toBe(true);
      expect(result[1].staffId).toBe('STAFF001');
    });
  });
});