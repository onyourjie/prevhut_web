import { Module } from '@nestjs/common';
import { EmergencyController } from './emergency.controller.js';

@Module({
  controllers: [EmergencyController],
})
export class EmergencyModule {}
