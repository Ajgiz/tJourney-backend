import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class RatingScheduleService {
  constructor(private scheduleRegistry: SchedulerRegistry) {}
  addTimeout(name: string, callback: () => void, ms: number) {
    const timeout = setTimeout(callback, ms);
    this.scheduleRegistry.addTimeout(name, timeout);
  }
  getTimeout(name: string) {
    try {
      return this.scheduleRegistry.getTimeout(name);
    } catch (e) {
      return null;
    }
  }
}
