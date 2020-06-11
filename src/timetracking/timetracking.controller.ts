import { Controller, Get } from "@nestjs/common"
import { TimetrackingService } from "./timetracking.service"

@Controller("timetracking")
export class TimetrackingController {
  constructor(private readonly timetrackingService: TimetrackingService) {}

  @Get()
  public bookTime(): string {
    return this.timetrackingService.sendEmail()
  }
}
