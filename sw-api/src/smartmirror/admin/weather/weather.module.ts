import { Module } from '@nestjs/common'
import { WeatherController } from './weather.controller'
import { ConstantsService } from '../../../global/constants/constants.service'
import { WeatherSettingDbService } from '../../../database/weather-setting-db.service'
import { PrismaService } from '../../../database/prisma.service'

@Module({
  controllers: [WeatherController],
  imports: [],
  providers: [ConstantsService, WeatherSettingDbService, PrismaService],
})
export class WeatherModule {}
