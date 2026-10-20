import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncScheduler } from './sync.scheduler.js';
import { SyncController } from './sync.controller.js';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SyncController],
  providers: [SyncScheduler],
  exports: [SyncScheduler],
})
export class AppSchedulerModule {}
