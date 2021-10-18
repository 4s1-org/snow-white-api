import { Test, TestingModule } from '@nestjs/testing'
import { DateController } from './date.controller.js'
import { DateSettingsService } from './settings/date-settings.service.js'
import { DateSettingsEntity } from '../../../entities/date-settings.entity.js'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DateSettingsDto } from '../../../dataTransferObjects/date-settings.dto.js'

describe('Date Controller', () => {
  let controller: DateController
  let settingsService: DateSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DateController],
      providers: [
        DateSettingsService,
        {
          provide: getRepositoryToken(DateSettingsEntity),
          useClass: Repository,
        },
      ],
    }).compile()

    controller = module.get<DateController>(DateController)
    settingsService = module.get<DateSettingsService>(DateSettingsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Settings', () => {
    it('GET /settings', async () => {
      // Arrange
      const data: DateSettingsDto = {
        fontSize: 12,
        isActive: true,
        pattern: 'bar',
      }
      jest.spyOn(settingsService, 'load').mockImplementation(() => Promise.resolve(data))
      // Act
      const res: DateSettingsDto = await controller.loadSettings()
      // Assert
      expect(settingsService.load).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
    })

    it('PUT /settings', async () => {
      // Arrange
      jest.spyOn(settingsService, 'save').mockImplementation(() => Promise.resolve())
      // Act
      await controller.saveSettings({
        fontSize: 12,
        isActive: true,
        pattern: 'bar',
      })
      // Assert
      expect(settingsService.save).toHaveBeenCalledTimes(1)
    })
  })
})
