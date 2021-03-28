import { Test, TestingModule } from '@nestjs/testing'
import { WeatherController } from './weather.controller'
import { WeatherSettingsService } from './settings/weather-settings.service'
import { WeatherSettingsDto } from '../../../dataTransferObjects/weather-settings.dto'

describe('WeatherController', () => {
  let controller: WeatherController
  let settingsService: WeatherSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherSettingsService,
          useValue: {
            load: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<WeatherController>(WeatherController)
    settingsService = module.get<WeatherSettingsService>(WeatherSettingsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Settings', () => {
    it('GET /settings', async () => {
      // Arrange
      const data: WeatherSettingsDto = {
        apiKey: 'foo',
        isActive: true,
        locationId: 'def',
      }
      jest.spyOn(settingsService, 'load').mockImplementation(() => Promise.resolve(data))
      // Act
      const res: WeatherSettingsDto = await controller.loadSettings()
      // Assert
      expect(settingsService.load).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
    })

    it('PUT /settings', async () => {
      // Arrange
      jest.spyOn(settingsService, 'save').mockImplementation(() => Promise.resolve())
      // Act
      await controller.saveSettings({
        apiKey: 'foo',
        isActive: true,
        locationId: 'def',
      })
      // Assert
      expect(settingsService.save).toHaveBeenCalledTimes(1)
    })
  })
})
