import { Module } from "@nestjs/common";
import { HotspotsController } from "./hotspots.controller.js";
import { HotspotsService } from "./hotspots.service.js";

@Module({
  controllers: [HotspotsController],
  providers: [HotspotsService],
  exports: [HotspotsService],
})
export class HotspotsModule {}
