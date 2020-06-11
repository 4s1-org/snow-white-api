import { Module } from "@nestjs/common"
import { WeatherController } from "./weather.controller"
import { WeatherSettingsService } from "./settings/weather-settings.service"
import { WeatherSettingsEntity } from "../../../entities/weather-settings.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConstantsService } from "../../../global/constants/constants.service"

@Module({
  controllers: [WeatherController],
  imports: [TypeOrmModule.forFeature([WeatherSettingsEntity])],
  providers: [WeatherSettingsService, ConstantsService],
})
export class WeatherModule {}
