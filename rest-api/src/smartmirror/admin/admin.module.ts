import { Module } from '@nestjs/common'
import { CommonModule } from './common/common.module'
import { FuelPriceModule } from './fuel-price/fuel-price.module'
import { DateModule } from './date/date.module'
import { TimetableModule } from './timetable/timetable.module'
import { WeatherModule } from './weather/weather.module'
import { TrafficModule } from './traffic/traffic.module'

@Module({
  imports: [CommonModule, FuelPriceModule, DateModule, TimetableModule, WeatherModule, TrafficModule],
})
export class AdminModule {}
