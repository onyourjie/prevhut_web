import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { CommunityModule } from './community/community.module.js';
import { AssignmentsModule } from './assignments/assignments.module.js';
import { EmergencyModule } from './emergency/emergency.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { AppSchedulerModule } from './scheduler/scheduler.module.js';
import { HotspotsModule } from './hotspots/hotspots.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AppSchedulerModule,
    HotspotsModule,
    AuthModule,
    UsersModule,
    CommunityModule,
    AssignmentsModule,
    EmergencyModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
