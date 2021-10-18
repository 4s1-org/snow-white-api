import { Module } from '@nestjs/common'
import { WeatherController } from './weather.controller.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'
import { WeatherSettingDbService } from '../../../database/weather-setting-db.service.js'
import { PrismaService } from '../../../database/prisma.service.js'

@Module({
  controllers: [WeatherController],
  imports: [],
  providers: [ConstantsService, WeatherSettingDbService, PrismaService],
})
export class WeatherModule {}
