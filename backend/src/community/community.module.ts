import { Module } from '@nestjs/common';
import { CommunityService } from './community.service.js';
import { CommunityController } from './community.controller.js';
import { ModerationService } from './moderation.service.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { HotspotsModule } from '../hotspots/hotspots.module.js';

@Module({
  imports: [NotificationsModule, HotspotsModule],
  controllers: [CommunityController],
  providers: [CommunityService, ModerationService],
  exports: [CommunityService, ModerationService],
})
export class CommunityModule {}
