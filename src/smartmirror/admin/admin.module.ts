import { Module } from '@nestjs/common'
import { CommonModule } from './common/common.module.js'
import { FuelPriceModule } from './fuel-price/fuel-price.module.js'
import { DateModule } from './date/date.module.js'
import { TimetableModule } from './timetable/timetable.module.js'
import { WeatherModule } from './weather/weather.module.js'
import { TrafficModule } from './traffic/traffic.module.js'

@Module({
  imports: [CommonModule, FuelPriceModule, DateModule, TimetableModule, WeatherModule, TrafficModule],
})
export class AdminModule {}
