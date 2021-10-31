import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommonLocationEntity } from '../../../../entities/common-location.entity.js'
import { ConstantsService } from '../../../../global/constants/constants.service.js'
import { WeatherSettingsEntity } from '../../../../entities/weather-settings.entity.js'
import { WeatherSettingsService } from './weather-settings.service.js'
import { WeatherSettingsDto } from '../../../../dataTransferObjects/weather-settings.dto.js'

describe('WeatherSettingsService', () => {
  let service: WeatherSettingsService
  let constants: ConstantsService
  let repo: Repository<WeatherSettingsEntity>

  const someLocation: CommonLocationEntity = Object.freeze({
    id: 'abc',
    latitude: 30,
    longitude: 10,
    name: 'foo',
    nameOrigin: 'foobar',
    sortNo: 1,
  })
  const someSettingEntity: WeatherSettingsEntity = Object.freeze({
    apiKey: 'apikey',
    commonLocation: someLocation,
    id: 'foo',
    isActive: true,
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherSettingsService,
        ConstantsService,
        {
          provide: getRepositoryToken(WeatherSettingsEntity),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<WeatherSettingsService>(WeatherSettingsService)
    constants = module.get<ConstantsService>(ConstantsService)
    repo = module.get<Repository<WeatherSettingsEntity>>(getRepositoryToken(WeatherSettingsEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('save when no record is present should create a new record', async () => {
    // Arrange
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined)
    jest.spyOn(repo, 'insert').mockResolvedValueOnce(undefined)
    jest.spyOn(repo, 'update').mockResolvedValueOnce(undefined)

    const data: WeatherSettingsDto = {
      apiKey: 'foo',
      isActive: true,
      locationId: 'def',
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

    const data: WeatherSettingsDto = {
      apiKey: 'foo',
      isActive: true,
      locationId: 'uvw',
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
    const res: WeatherSettingsDto = await service.load()
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
    const res: WeatherSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.apiKey).toBe('apik' + constants.hiddenValue)
  })
})
