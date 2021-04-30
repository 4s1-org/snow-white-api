import { Injectable, Logger } from '@nestjs/common'
import { TrafficSettingsService } from '../../admin/traffic/settings/traffic-settings.service'
import { FuelPriceSettingsService } from '../../admin/fuel-price/settings/fuel-price-settings.service'
import { TimetableSettingsService } from '../../admin/timetable/settings/timetable-settings.service'
import { WeatherSettingsService } from '../../admin/weather/settings/weather-settings.service'
import { DateSettingsService } from '../../admin/date/settings/date-settings.service'
import { UiSettingsDto } from '../../../dataTransferObjects/ui-settings.dto'

@Injectable()
export class UiSettingsService {
  private readonly logger: Logger = new Logger(UiSettingsService.name)

  constructor(
    private readonly trafficSettings: TrafficSettingsService,
    private readonly fuelPriceSettings: FuelPriceSettingsService,
    private readonly timetableSettings: TimetableSettingsService,
    private readonly weatherSettings: WeatherSettingsService,
    private readonly dateSettings: DateSettingsService,
  ) {}

  public async load(): Promise<UiSettingsDto> {
    const trafficRecord = await this.trafficSettings.getRecord()
    const fuelPriceRecord = await this.fuelPriceSettings.getRecord()
    const timetableRecord = await this.timetableSettings.getRecord()
    const weatherRecord = await this.weatherSettings.getRecord()
    const dateRecord = await this.dateSettings.getRecord()

    const result: UiSettingsDto = {
      date: {
        fontSize: dateRecord.fontSize,
        isActive: dateRecord.isActive,
      },
      fuelPrice: {
        interval: fuelPriceRecord.interval,
        isActive: fuelPriceRecord.isActive,
        showDiesel: fuelPriceRecord.showDiesel,
        showE10: fuelPriceRecord.showE10,
        showE5: fuelPriceRecord.showE5,
      },
      timetable: {
        isActive: timetableRecord.isActive,
      },
      traffic: {
        isActive: trafficRecord.isActive,
      },
      weather: {
        isActive: weatherRecord.isActive,
      },
    }

    return result
  }
}
