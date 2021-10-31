import { Module } from '@nestjs/common'
import { UiController } from './ui.controller'
import { UiDateService } from './date/ui-date.service.js'
import { UiTimetableService } from './timetable/ui-timetable.service.js'
import { UiWeatherService } from './weather/ui-weather.service.js'
import { UiTrafficService } from './traffic/ui-traffic.service.js'
import { UiFuelPriceService } from './fuel-price/ui-fuel-price.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FuelPriceStationEntity } from '../../entities/fuel-price-station.entity.js'
import { RemoteApiCallModule } from '../../remote-api-call/remote-api-call.module.js'
import { TrafficSettingsEntity } from '../../entities/traffic-settings.entity.js'
import { TrafficSettingsService } from '../admin/traffic/settings/traffic-settings.service.js'
import { WeatherSettingsService } from '../admin/weather/settings/weather-settings.service.js'
import { DateSettingsService } from '../admin/date/settings/date-settings.service.js'
import { TimetableSettingsService } from '../admin/timetable/settings/timetable-settings.service.js'
import { TrafficModule } from '../admin/traffic/traffic.module.js'
import { AdminModule } from '../admin/admin.module.js'
import { DateSettingsEntity } from '../../entities/date-settings.entity.js'
import { FuelPriceSettingsService } from '../admin/fuel-price/settings/fuel-price-settings.service.js'
import { FuelPriceSettingsEntity } from '../../entities/fuel-price-settings.entity.js'
import { TimetableSettingsEntity } from '../../entities/timetable-settings.entity.js'
import { TimetableStationEntity } from '../../entities/timetable-station.entity.js'
import { WeatherSettingsEntity } from '../../entities/weather-settings.entity.js'
import { UiSettingsService } from './settings/ui-settings.service.js'
import { CommonSettingsService } from '../admin/common/settings/common-settings.service.js'
import { CommonSettingsEntity } from '../../entities/common-settings.entity.js'

@Module({
  controllers: [UiController],
  imports: [
    RemoteApiCallModule,
    TrafficModule,
    AdminModule,
    TypeOrmModule.forFeature([
      FuelPriceStationEntity,
      TrafficSettingsEntity,
      DateSettingsEntity,
      FuelPriceSettingsEntity,
      TimetableSettingsEntity,
      TimetableStationEntity,
      WeatherSettingsEntity,
      CommonSettingsEntity,
    ]),
  ],
  providers: [
    CommonSettingsService,
    UiFuelPriceService,
    UiDateService,
    UiTimetableService,
    UiWeatherService,
    UiTrafficService,
    TrafficSettingsService,
    FuelPriceSettingsService,
    DateSettingsService,
    WeatherSettingsService,
    TimetableSettingsService,
    UiSettingsService,
  ],
})
export class UiModule {}
