import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncScheduler } from './sync.scheduler.js';
import { SyncController } from './sync.controller.js';
import { HotspotsModule } from '../hotspots/hotspots.module.js';

@Module({
  imports: [ScheduleModule.forRoot(), HotspotsModule],
  controllers: [SyncController],
  providers: [SyncScheduler],
  exports: [SyncScheduler],
})
export class AppSchedulerModule {}
