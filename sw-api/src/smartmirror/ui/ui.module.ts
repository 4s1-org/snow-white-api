import { Module } from '@nestjs/common'
import { UiController } from './ui.controller'
import { UiDateService } from './date/ui-date.service'
import { UiTimetableService } from './timetable/ui-timetable.service'
import { UiWeatherService } from './weather/ui-weather.service'
import { UiTrafficService } from './traffic/ui-traffic.service'
import { UiFuelPriceService } from './fuel-price/ui-fuel-price.service'
import { RemoteApiCallModule } from '../../remote-api-call/remote-api-call.module'
import { TrafficSettingsService } from '../admin/traffic/settings/traffic-settings.service'
//import { TimetableSettingsService } from '../admin/timetable/settings/timetable-settings.service'
import { TrafficModule } from '../admin/traffic/traffic.module'
import { AdminModule } from '../admin/admin.module'
//import { FuelPriceSettingsService } from '../admin/fuel-price/settings/fuel-price-settings.service'
import { UiSettingsService } from './settings/ui-settings.service'
import { TimetableSettingDbService } from '../../database/timetable-setting-db.service'
import { TrafficSettingDbService } from '../../database/traffic-setting-db.service'
import { WeatherSettingDbService } from '../../database/weather-setting-db.service'
import { FuelPriceStationDbService } from '../../database/fuel-price-station-db.service'
import { CommonSettingDbService } from '../../database/common-setting-db.service'
import { PrismaService } from '../../database/prisma.service'
import { FuelPriceSettingDbService } from '../../database/fuel-price-setting-db.service'
import { DateSettingDbService } from '../../database/date-setting-db.service'

@Module({
  controllers: [UiController],
  imports: [RemoteApiCallModule, TrafficModule, AdminModule],
  providers: [
    UiFuelPriceService,
    UiDateService,
    UiTimetableService,
    UiWeatherService,
    UiTrafficService,
    TrafficSettingsService,
    //FuelPriceSettingsService,
    //TimetableSettingsService,
    UiSettingsService,
    PrismaService,
    WeatherSettingDbService,
    TrafficSettingDbService,
    CommonSettingDbService,
    DateSettingDbService,
    FuelPriceSettingDbService,
    TimetableSettingDbService,
    FuelPriceStationDbService,
  ],
})
export class UiModule {}
