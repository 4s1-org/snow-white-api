import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { TimetableSettingsService } from './timetable-settings.service'
import { TimetableSettingsEntity } from '../../../../entities/timetable-settings.entity'
import { TimetableSettingsDto } from '../../../../dataTransferObjects/timetable-settings.dto'

describe('TimetableSettingsService', () => {
  let service: TimetableSettingsService
  let constants: ConstantsService
  let repo: Repository<TimetableSettingsEntity>

  const someSettingEntity: TimetableSettingsEntity = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimetableSettingsService,
        ConstantsService,
        {
          provide: getRepositoryToken(TimetableSettingsEntity),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<TimetableSettingsService>(TimetableSettingsService)
    constants = module.get<ConstantsService>(ConstantsService)
    repo = module.get<Repository<TimetableSettingsEntity>>(getRepositoryToken(TimetableSettingsEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('save when no record is present should create a new record', async () => {
    // Arrange
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined)
    jest.spyOn(repo, 'insert').mockResolvedValueOnce(undefined)
    jest.spyOn(repo, 'update').mockResolvedValueOnce(undefined)

    const data: TimetableSettingsDto = {
      apiKey: 'apikey',
      isActive: true,
      lines: {
        showBus: false,
        showIC: false,
        showICE: false,
        showRB: true,
        showRE: true,
        showSBahn: true,
        showTram: true,
        showUBahn: true,
      },
      maxChanges: 3,
      stationFromId: 'abc',
      stationToId: 'def',
    }
    // Act
    await service.save(data)
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.insert).toHaveBeenCalledTimes(1)
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it('save when record is present should update existing record', async () => {
    // Arrange
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(someSettingEntity)
    jest.spyOn(repo, 'update').mockResolvedValueOnce(undefined)

    const data: TimetableSettingsDto = {
      apiKey: 'foo',
      isActive: true,
      lines: {
        showBus: false,
        showIC: false,
        showICE: false,
        showRB: true,
        showRE: true,
        showSBahn: true,
        showTram: true,
        showUBahn: true,
      },
      maxChanges: 3,
      stationFromId: 'abc',
      stationToId: 'def',
    }
    // Act
    await service.save(data)
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it('load when no record is present should create a new record', async () => {
    // Arrange
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined)
    jest.spyOn(repo, 'insert').mockResolvedValueOnce(undefined)
    // Act
    const res: TimetableSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.insert).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.isActive).toBe(false) // this is the default value
  })

  it('load when record is present should return existing record', async () => {
    // Arrange
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(someSettingEntity)
    // Act
    const res: TimetableSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.apiKey).toBe('apik' + constants.hiddenValue)
  })
})
