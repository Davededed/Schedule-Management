import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'schedules',
})
export class Schedule extends Document {
  @Prop({ 
    required: true, 
    index: true,
    trim: true,
  })
  staffId: string;

  @Prop({ 
    required: true, 
    type: Date,
    index: true,
  })
  date: Date;

  @Prop({ 
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  })
  startTime: string;

  @Prop({ 
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  })
  endTime: string;

  @Prop({ 
    required: true,
    min: 1,
    max: 1440, // Maximum 24 hours in minutes
  })
  interval: number;

  @Prop({ 
    default: true,
    index: true,
  })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

// Compound index for efficient queries
ScheduleSchema.index({ staffId: 1, date: 1 }, { unique: true });

// Pre-save middleware to update the updatedAt field
ScheduleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Pre-update middleware to update the updatedAt field
ScheduleSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  this.set({ updatedAt: new Date() });
  next();
});