import { Controller, Get, Put, Body } from "@nestjs/common"
import { DateSettingsService } from "./settings/date-settings.service"
import { DateSettingsDto } from "../../../dataTransferObjects/date-settings.dto"

@Controller("/v1/smartmirror/admin/date")
export class DateController {
  constructor(private readonly settings: DateSettingsService) {}

  // GET - /v1/smartmirror/admin/date/settings
  @Get("/settings")
  public async loadSettings(): Promise<DateSettingsDto> {
    return this.settings.load()
  }

  // PUT - /v1/smartmirror/admin/date/settings
  @Put("/settings")
  public async saveSettings(@Body() body: DateSettingsDto): Promise<void> {
    return this.settings.save(body)
  }
}
