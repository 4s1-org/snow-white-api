import { Controller, Get, Put, Logger, Body } from '@nestjs/common'
import { TrafficSettingsService } from './settings/traffic-settings.service'
import { TrafficSettingsDto } from '../../../dataTransferObjects/traffic-settings.dto'

// ToDo: Namen korrigieren
@Controller('/v1/smartmirror/admin/traffic')
export class TrafficController {
  private readonly logger: Logger = new Logger(TrafficController.name)

  constructor(private readonly settings: TrafficSettingsService) {}

  // GET - /v1/smartmirror/admin/traffic/settings
  @Get('/settings')
  public loadSettings(): Promise<TrafficSettingsDto> {
    return this.settings.load()
  }

  // PUT - //v1/smartmirror/admin/traffic/settings
  @Put('/settings')
  public saveSettings(@Body() settings: TrafficSettingsDto): Promise<void> {
    return this.settings.save(settings)
  }
}
