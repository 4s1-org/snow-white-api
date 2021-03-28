import { Test, TestingModule } from '@nestjs/testing'
import { DateSettingsService } from '../../admin/date/settings/date-settings.service'
import { DateSettingsEntity } from '../../../entities/date-settings.entity'
import { UiSettingsService } from './ui-settings.service'
import { TrafficSettingsService } from '../../admin/traffic/settings/traffic-settings.service'
import { FuelPriceSettingsService } from '../../admin/fuel-price/settings/fuel-price-settings.service'
import { TimetableSettingsService } from '../../admin/timetable/settings/timetable-settings.service'
import { WeatherSettingsService } from '../../admin/weather/settings/weather-settings.service'
import { UiSettingsDto } from '../../../dataTransferObjects/ui-settings.dto'
import { TrafficSettingsEntity } from '../../../entities/traffic-settings.entity'
import { TimetableSettingsEntity } from '../../../entities/timetable-settings.entity'
import { WeatherSettingsEntity } from '../../../entities/weather-settings.entity'
import { FuelPriceSettingsEntity } from '../../../entities/fuel-price-settings.entity'

describe('UiSettingsService', () => {
  let service: UiSettingsService
  let dateSettingsService: DateSettingsService
  let trafficSettingsService: TrafficSettingsService
  let fuelPriceSettingsService: FuelPriceSettingsService
  let timetableSettingsService: TimetableSettingsService
  let weatherSettingsService: WeatherSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UiSettingsService,
        {
          provide: DateSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: TrafficSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: FuelPriceSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: TimetableSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: WeatherSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UiSettingsService>(UiSettingsService)
    dateSettingsService = module.get<DateSettingsService>(DateSettingsService)
    trafficSettingsService = module.get<TrafficSettingsService>(TrafficSettingsService)
    fuelPriceSettingsService = module.get<FuelPriceSettingsService>(FuelPriceSettingsService)
    timetableSettingsService = module.get<TimetableSettingsService>(TimetableSettingsService)
    weatherSettingsService = module.get<WeatherSettingsService>(WeatherSettingsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('load settings', async () => {
    // Arrange
    const dateData: DateSettingsEntity = {
      fontSize: 12,
      id: 'foo',
      isActive: true,
      pattern: 'bar',
    }
    const timetableData: TimetableSettingsEntity = {
      apiKey: 'apikey_some_text',
      id: 'foo',
      isActive: false,
      maxChanges: 3,
      showBus: false,
      showIC: false,
      showICE: false,
      showRB: true,
      showRE: true,
      showSBahn: true,
      showTram: true,
      showUBahn: true,
      timetableStationFrom: null,
      timetableStationTo: null,
    }
    const weatherData: WeatherSettingsEntity = {
      apiKey: 'apikey',
      commonLocation: null,
      id: 'foo',
      isActive: true,
    }
    const trafficData: TrafficSettingsEntity = {
      apiKey: 'apikey',
      commonLocationFrom: null,
      commonLocationTo: null,
      id: 'foo',
      isActive: true,
    }
    const fuelPriceData: FuelPriceSettingsEntity = {
      apiKey: 'abc',
      id: 'foo',
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    jest.spyOn(dateSettingsService, 'getRecord').mockResolvedValueOnce(dateData)
    jest.spyOn(timetableSettingsService, 'getRecord').mockResolvedValueOnce(timetableData)
    jest.spyOn(weatherSettingsService, 'getRecord').mockResolvedValueOnce(weatherData)
    jest.spyOn(trafficSettingsService, 'getRecord').mockResolvedValueOnce(trafficData)
    jest.spyOn(fuelPriceSettingsService, 'getRecord').mockResolvedValueOnce(fuelPriceData)
    // Act
    const res: UiSettingsDto = await service.load()
    // Assert
    expect(dateSettingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(timetableSettingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(weatherSettingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(trafficSettingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(fuelPriceSettingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.date.isActive).toBe(true)
  })
})
