import { Module } from '@nestjs/common'
import { UiController } from './ui.controller.js'
import { UiDateService } from './date/ui-date.service.js'
import { UiTimetableService } from './timetable/ui-timetable.service.js'
import { UiWeatherService } from './weather/ui-weather.service.js'
import { UiTrafficService } from './traffic/ui-traffic.service.js'
import { UiFuelPriceService } from './fuel-price/ui-fuel-price.service.js'
import { RemoteApiCallModule } from '../../remote-api-call/remote-api-call.module.js'
import { TrafficSettingsService } from '../admin/traffic/settings/traffic-settings.service.js'
//import { TimetableSettingsService } from '../admin/timetable/settings/timetable-settings.service.js'
import { TrafficModule } from '../admin/traffic/traffic.module.js'
import { AdminModule } from '../admin/admin.module.js'
//import { FuelPriceSettingsService } from '../admin/fuel-price/settings/fuel-price-settings.service.js'
import { UiSettingsService } from './settings/ui-settings.service.js'
import { TimetableSettingDbService } from '../../database/timetable-setting-db.service.js'
import { TrafficSettingDbService } from '../../database/traffic-setting-db.service.js'
import { WeatherSettingDbService } from '../../database/weather-setting-db.service.js'
import { FuelPriceStationDbService } from '../../database/fuel-price-station-db.service.js'
import { CommonSettingDbService } from '../../database/common-setting-db.service.js'
import { PrismaService } from '../../database/prisma.service.js'
import { FuelPriceSettingDbService } from '../../database/fuel-price-setting-db.service.js'
import { DateSettingDbService } from '../../database/date-setting-db.service.js'

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
