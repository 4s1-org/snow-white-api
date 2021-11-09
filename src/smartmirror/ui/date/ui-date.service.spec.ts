import { Test, TestingModule } from '@nestjs/testing'
import { DateSettingsService } from '../../admin/date/settings/date-settings.service'
import { DateSettingsEntity } from '../../../entities/date-settings.entity'
import { UiDateService } from './ui-date.service'

describe('UiDateService', () => {
  let service: UiDateService
  let settingsService: DateSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UiDateService,
        {
          provide: DateSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UiDateService>(UiDateService)
    settingsService = module.get<DateSettingsService>(DateSettingsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('getPattern', async () => {
    // Arrange
    const data: DateSettingsEntity = {
      fontSize: 12,
      id: 'foo',
      isActive: true,
      pattern: 'bar',
    }
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(data)
    // Act
    const res: string = await service.getPattern()
    // Assert
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res).toBe('bar')
  })

  it('getPattern with no disabled widget', async () => {
    // Arrange
    const data: DateSettingsEntity = {
      fontSize: 12,
      id: 'foo',
      isActive: false,
      pattern: 'bar',
    }
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(data)
    // Act + Assert
    await expect(service.getPattern()).rejects.toThrow(Error)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
  })
})
