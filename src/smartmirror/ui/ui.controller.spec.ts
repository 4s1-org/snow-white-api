import { Test, TestingModule } from '@nestjs/testing'
import { UiController } from './ui.controller.js'
import { UiFuelPriceService } from './fuel-price/ui-fuel-price.service.js'
import { UiDateService } from './date/ui-date.service.js'
import { UiTimetableService } from './timetable/ui-timetable.service.js'
import { UiTrafficService } from './traffic/ui-traffic.service.js'
import { UiWeatherService } from './weather/ui-weather.service.js'
import { CarRoutesDto } from '../../dataTransferObjects/car-routes.dto.js'
import { RmvTripsDto } from '../../dataTransferObjects/rmv-trips.dto.js'
import { FuelPricePricesDto } from '../../dataTransferObjects/fuel-price-prices.dto.js'
import { UiSettingsService } from './settings/ui-settings.service.js'
import { UiSettingsDto } from '../../dataTransferObjects/ui-settings.dto.js'
import { WeatherDatasDto } from '../../dataTransferObjects/weather-datas.dto.js'

describe('Ui Controller', () => {
  let controller: UiController
  let dateService: UiDateService
  let fuelPriceService: UiFuelPriceService
  let timetableService: UiTimetableService
  let trafficService: UiTrafficService
  let weatherService: UiWeatherService
  let settingsService: UiSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UiController],
      providers: [
        {
          provide: UiDateService,
          useValue: {
            getPattern: jest.fn(),
          },
        },
        {
          provide: UiFuelPriceService,
          useValue: {
            getPrices: jest.fn(),
          },
        },
        {
          provide: UiTimetableService,
          useValue: {
            getTimetable: jest.fn(),
          },
        },
        {
          provide: UiTrafficService,
          useValue: {
            getRoute: jest.fn(),
          },
        },
        {
          provide: UiWeatherService,
          useValue: {
            getWeather: jest.fn(),
          },
        },
        {
          provide: UiSettingsService,
          useValue: {
            load: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<UiController>(UiController)
    dateService = module.get<UiDateService>(UiDateService)
    fuelPriceService = module.get<UiFuelPriceService>(UiFuelPriceService)
    timetableService = module.get<UiTimetableService>(UiTimetableService)
    trafficService = module.get<UiTrafficService>(UiTrafficService)
    weatherService = module.get<UiWeatherService>(UiWeatherService)
    settingsService = module.get<UiSettingsService>(UiSettingsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('GET /fuelprice', async () => {
    // Arrange
    const data: Array<FuelPricePricesDto> = [
      {
        diesel: 1.109,
        e10: 1.319,
        e5: 1.339,
        name: 'foo',
        open: true,
        sortNo: 42,
      },
    ]
    jest.spyOn(fuelPriceService, 'getPrices').mockResolvedValueOnce(data)
    // Act
    const res: Array<FuelPricePricesDto> = await controller.getFuelPrices()
    // Assert
    expect(fuelPriceService.getPrices).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(1)
  })

  it('GET /date', async () => {
    // Arrange
    const data = 'dd.MM.yyy'
    jest.spyOn(dateService, 'getPattern').mockResolvedValueOnce(data)
    // Act
    const res: string = await controller.loadDate()
    // Assert
    expect(dateService.getPattern).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res).toBe(data)
  })

  it('GET /timetable', async () => {
    // Arrange
    const data: RmvTripsDto = {
      text: 'foobar',
      trips: [
        {
          arrivalTimePlanned: 1,
          arrivalTimeReal: 1,
          durationPlanned: 1,
          durationReal: 1,
          lines: ['RB'],
          startTimePlanned: 1,
          startTimeReal: 1,
          trackPlanned: '1',
          trackReal: '1',
          tripId: 'bar',
        },
      ],
    }
    jest.spyOn(timetableService, 'getTimetable').mockResolvedValueOnce(data)
    // Act
    const res: RmvTripsDto = await controller.loadTimetable()
    // Assert
    expect(timetableService.getTimetable).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.trips.length).toBe(1)
  })

  it('GET /weather', async () => {
    // Arrange
    const data: WeatherDatasDto = {
      infos: [
        {
          conditionText: 'foo',
          icon: 'foo',
          temperature: 12.3,
          temperatureFeelsLike: 24.3,
          timestamp: 1523254125,
        },
      ],
      name: 'foo',
    }
    jest.spyOn(weatherService, 'getWeather').mockResolvedValueOnce(data)
    // Act
    const res: WeatherDatasDto = await controller.loadWeather()
    // Assert
    expect(weatherService.getWeather).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.infos.length).toBe(1)
    expect(res.infos[0].temperature).toBe(12.3)
  })

  it('GET /traffic', async () => {
    // Arrange
    const data: CarRoutesDto = {
      routes: [
        {
          distance: 99,
          expectedTime: 234,
          streetTypes: ['A5', 'B49'],
          text: 'Foo',
        },
      ],
      text: 'foobar',
    }
    jest.spyOn(trafficService, 'getRoute').mockResolvedValueOnce(data)
    // Act
    const res: CarRoutesDto = await controller.loadTraffic()
    // Assert
    expect(trafficService.getRoute).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.routes.length).toBe(1)
  })

  it('GET /settings', async () => {
    // Arrange
    const data: UiSettingsDto = {
      date: {
        fontSize: 12,
        isActive: true,
      },
      fuelPrice: {
        interval: 15 * 3600,
        isActive: true,
        showDiesel: true,
        showE10: true,
        showE5: true,
      },
      timetable: {
        isActive: true,
      },
      traffic: {
        isActive: true,
      },
      weather: {
        isActive: true,
      },
    }
    jest.spyOn(settingsService, 'load').mockResolvedValueOnce(data)
    // Act
    const res: UiSettingsDto = await controller.loadSettings()
    // Assert
    expect(settingsService.load).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.date.isActive).toBe(true)
  })
})
