import { Module } from '@nestjs/common'
import { UiController } from './ui.controller'
import { UiDateService } from './date/ui-date.service'
import { UiTimetableService } from './timetable/ui-timetable.service'
import { UiWeatherService } from './weather/ui-weather.service'
import { UiTrafficService } from './traffic/ui-traffic.service'
import { UiFuelPriceService } from './fuel-price/ui-fuel-price.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FuelPriceStationEntity } from '../../entities/fuel-price-station.entity'
import { RemoteApiCallModule } from '../../remote-api-call/remote-api-call.module'
import { TrafficSettingsEntity } from '../../entities/traffic-settings.entity'
import { TrafficSettingsService } from '../admin/traffic/settings/traffic-settings.service'
import { WeatherSettingsService } from '../admin/weather/settings/weather-settings.service'
import { DateSettingsService } from '../admin/date/settings/date-settings.service'
import { TimetableSettingsService } from '../admin/timetable/settings/timetable-settings.service'
import { TrafficModule } from '../admin/traffic/traffic.module'
import { AdminModule } from '../admin/admin.module'
import { DateSettingsEntity } from '../../entities/date-settings.entity'
import { FuelPriceSettingsService } from '../admin/fuel-price/settings/fuel-price-settings.service'
import { FuelPriceSettingsEntity } from '../../entities/fuel-price-settings.entity'
import { TimetableSettingsEntity } from '../../entities/timetable-settings.entity'
import { TimetableStationEntity } from '../../entities/timetable-station.entity'
import { WeatherSettingsEntity } from '../../entities/weather-settings.entity'
import { UiSettingsService } from './settings/ui-settings.service'
import { CommonSettingsService } from '../admin/common/settings/common-settings.service'
import { CommonSettingsEntity } from '../../entities/common-settings.entity'

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
