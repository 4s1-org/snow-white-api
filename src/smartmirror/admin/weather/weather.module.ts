import { Module } from '@nestjs/common'
import { WeatherController } from './weather.controller.js'
import { WeatherSettingsService } from './settings/weather-settings.service.js'
import { WeatherSettingsEntity } from '../../../entities/weather-settings.entity.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConstantsService } from '../../../global/constants/constants.service.js'

@Module({
  controllers: [WeatherController],
  imports: [TypeOrmModule.forFeature([WeatherSettingsEntity])],
  providers: [WeatherSettingsService, ConstantsService],
})
export class WeatherModule {}
