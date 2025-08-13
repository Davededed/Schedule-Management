import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/schedule-management',
    ),
    SchedulesModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}