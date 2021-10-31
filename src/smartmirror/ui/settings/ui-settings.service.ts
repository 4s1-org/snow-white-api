import { Injectable, Logger } from '@nestjs/common'
import { WeatherSettingsEntity } from '../../../entities/weather-settings.entity.js'
import { TrafficSettingsService } from '../../admin/traffic/settings/traffic-settings.service.js'
import { TrafficSettingsEntity } from '../../../entities/traffic-settings.entity.js'
import { FuelPriceSettingsService } from '../../admin/fuel-price/settings/fuel-price-settings.service.js'
import { TimetableSettingsService } from '../../admin/timetable/settings/timetable-settings.service.js'
import { WeatherSettingsService } from '../../admin/weather/settings/weather-settings.service.js'
import { DateSettingsService } from '../../admin/date/settings/date-settings.service.js'
import { FuelPriceSettingsEntity } from '../../../entities/fuel-price-settings.entity.js'
import { TimetableSettingsEntity } from '../../../entities/timetable-settings.entity.js'
import { DateSettingsEntity } from '../../../entities/date-settings.entity.js'
import { UiSettingsDto } from '../../../dataTransferObjects/ui-settings.dto.js'

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
    const trafficRecord: TrafficSettingsEntity = await this.trafficSettings.getRecord()
    const fuelPriceRecord: FuelPriceSettingsEntity = await this.fuelPriceSettings.getRecord()
    const timetableRecord: TimetableSettingsEntity = await this.timetableSettings.getRecord()
    const weatherRecord: WeatherSettingsEntity = await this.weatherSettings.getRecord()
    const dateRecord: DateSettingsEntity = await this.dateSettings.getRecord()

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
