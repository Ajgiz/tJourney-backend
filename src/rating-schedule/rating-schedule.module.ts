import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RatingScheduleService } from './rating-schedule.service';

@Module({
  providers: [RatingScheduleService],
  imports: [ScheduleModule.forRoot()],
  exports: [RatingScheduleService],
})
export class RatingScheduleModule {}
