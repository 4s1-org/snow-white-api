import { Test, TestingModule } from '@nestjs/testing'
import { CommonSettingsService } from './common-settings.service.js'
import { CommonSettingsEntity } from '../../../../entities/common-settings.entity.js'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CommonSettingsDto } from '../../../../dataTransferObjects/common-settings.dto.js'

describe('CommonSettingsService', () => {
  let service: CommonSettingsService
  let repo: Repository<CommonSettingsEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonSettingsService,
        {
          provide: getRepositoryToken(CommonSettingsEntity),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<CommonSettingsService>(CommonSettingsService)
    repo = module.get<Repository<CommonSettingsEntity>>(getRepositoryToken(CommonSettingsEntity))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('save when no record is present should create a new record', async () => {
    // Arrange
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined)
    jest.spyOn(repo, 'insert').mockResolvedValueOnce(undefined)
    jest.spyOn(repo, 'update').mockResolvedValueOnce(undefined)

    const data: CommonSettingsEntity = {
      id: 'foo',
      morningEnd: 2,
      morningStart: 1,
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
    const existingData: CommonSettingsEntity = {
      id: 'foo',
      morningEnd: 2,
      morningStart: 1,
    }
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(existingData)
    jest.spyOn(repo, 'update').mockResolvedValueOnce(undefined)

    const data: CommonSettingsEntity = {
      id: 'foo',
      morningEnd: 5,
      morningStart: 4,
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
    const res: CommonSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.insert).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.morningStart).toBe(5 * 3600)
    expect(res.morningEnd).toBe(12 * 3600)
  })

  it('load when record is present should return existing record', async () => {
    // Arrange
    const existingData: CommonSettingsEntity = {
      id: 'foo',
      morningEnd: 2,
      morningStart: 1,
    }
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(existingData)
    // Act
    const res: CommonSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.morningStart).toBe(1)
  })
})
