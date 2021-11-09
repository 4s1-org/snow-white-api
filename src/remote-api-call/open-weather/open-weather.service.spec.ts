import { Test, TestingModule } from '@nestjs/testing'
import { OpenWeatherService } from './open-weather.service'
import { RequestService } from '../request/request.service'
import * as weatherExample from './weatherExample.json'
import { WeatherDatasDto } from '../../dataTransferObjects/weather-datas.dto'

describe('OpenWeatherService', () => {
  let service: OpenWeatherService
  let requestService: RequestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenWeatherService,
        {
          provide: RequestService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<OpenWeatherService>(OpenWeatherService)
    requestService = module.get<RequestService>(RequestService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('get weather by coordinates', async () => {
    // Arrange
    jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(weatherExample))
    // Act
    const res: WeatherDatasDto = await service.getByCoordinates('apiKey', 50, 10)
    // Assert
    expect(requestService.get).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
  })
})
