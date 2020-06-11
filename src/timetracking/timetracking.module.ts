import { Module } from "@nestjs/common"
import { TimetrackingController } from "./timetracking.controller"
import { TimetrackingService } from "./timetracking.service"

@Module({
  controllers: [TimetrackingController],
  providers: [TimetrackingService],
})
export class TimetrackingModule {}
