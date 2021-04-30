import { Module } from '@nestjs/common'
import { UiController } from './ui.controller'
import { UiDateService } from './date/ui-date.service'
import { UiTimetableService } from './timetable/ui-timetable.service'
import { UiWeatherService } from './weather/ui-weather.service'
import { UiTrafficService } from './traffic/ui-traffic.service'
import { UiFuelPriceService } from './fuel-price/ui-fuel-price.service'
import { RemoteApiCallModule } from '../../remote-api-call/remote-api-call.module'
import { TrafficSettingsService } from '../admin/traffic/settings/traffic-settings.service'
import { WeatherSettingsService } from '../admin/weather/settings/weather-settings.service'
import { DateSettingsService } from '../admin/date/settings/date-settings.service'
import { TimetableSettingsService } from '../admin/timetable/settings/timetable-settings.service'
import { TrafficModule } from '../admin/traffic/traffic.module'
import { AdminModule } from '../admin/admin.module'
import { FuelPriceSettingsService } from '../admin/fuel-price/settings/fuel-price-settings.service'
import { UiSettingsService } from './settings/ui-settings.service'
import { CommonSettingsService } from '../admin/common/settings/common-settings.service'
import { CommonLocationDbService } from '../../database/common-location-db.service'
import { TimetrackingService } from '../../timetracking/timetracking.service'

@Module({
  controllers: [UiController],
  imports: [RemoteApiCallModule, TrafficModule, AdminModule],
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
