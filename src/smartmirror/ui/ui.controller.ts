import { Controller, Get, Logger } from '@nestjs/common'
import { UiFuelPriceService } from './fuel-price/ui-fuel-price.service'
import { UiDateService } from './date/ui-date.service'
import { UiTimetableService } from './timetable/ui-timetable.service'
import { UiTrafficService } from './traffic/ui-traffic.service'
import { UiWeatherService } from './weather/ui-weather.service'
import { CarRoutesDto } from '../../dataTransferObjects/car-routes.dto.js'
import { RmvTripsDto } from '../../dataTransferObjects/rmv-trips.dto.js'
import { FuelPricePricesDto } from '../../dataTransferObjects/fuel-price-prices.dto.js'
import { UiSettingsService } from './settings/ui-settings.service.js'
import { UiSettingsDto } from '../../dataTransferObjects/ui-settings.dto.js'
import { WeatherDatasDto } from '../../dataTransferObjects/weather-datas.dto.js'

@Controller('/v1/smartmirror/ui')
export class UiController {
  private readonly logger: Logger = new Logger(UiController.name)

  constructor(
    private readonly settings: UiSettingsService,
    private readonly date: UiDateService,
    private readonly fuelPrice: UiFuelPriceService,
    private readonly timetable: UiTimetableService,
    private readonly traffic: UiTrafficService,
    private readonly weather: UiWeatherService,
  ) {}

  // GET - /v1/smartmirror/ui/fuelprice
  @Get('/fuelprice')
  public getFuelPrices(): Promise<Array<FuelPricePricesDto>> {
    return this.fuelPrice.getPrices()
  }

  // GET - /v1/smartmirror/ui/date
  @Get('/date')
  public loadDate(): Promise<string> {
    return this.date.getPattern()
  }

  // GET - /v1/smartmirror/ui/timetable
  @Get('/timetable')
  public loadTimetable(): Promise<RmvTripsDto> {
    return this.timetable.getTimetable()
  }

  // GET - /v1/smartmirror/ui/weather
  @Get('/weather')
  public loadWeather(): Promise<WeatherDatasDto> {
    return this.weather.getWeather()
  }

  // GET - /v1/smartmirror/ui/traffic
  @Get('/traffic')
  public loadTraffic(): Promise<CarRoutesDto> {
    return this.traffic.getRoute()
  }

  // GET - /v1/smartmirror/ui/settings
  @Get('/settings')
  public loadSettings(): Promise<UiSettingsDto> {
    return this.settings.load()
  }
}
