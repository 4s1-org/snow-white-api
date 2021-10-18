import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SortOrderDto } from '../../../../dataTransferObjects/sort-order.dto.js'
import { TimetableStationEntity } from '../../../../entities/timetable-station.entity.js'
import { TimetableStationsService } from './timetable-stations.service.js'
import { RmvService } from '../../../../remote-api-call/rmv/rmv.service.js'
import { TimetableStationDto } from '../../../../dataTransferObjects/timetable-station.dto.js'
import { RmvStationDto } from '../../../../dataTransferObjects/rmv-station.dto.js'

describe('TimetableStationsService', () => {
  let service: TimetableStationsService
  let rmvService: RmvService
  let repo: Repository<TimetableStationEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimetableStationsService,
        {
          provide: getRepositoryToken(TimetableStationEntity),
          useClass: Repository,
        },
        {
          provide: RmvService,
          useValue: {
            getStations: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<TimetableStationsService>(TimetableStationsService)
    repo = module.get<Repository<TimetableStationEntity>>(getRepositoryToken(TimetableStationEntity))
    rmvService = module.get<RmvService>(RmvService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('Search gas station', async () => {
    // Arrange
    const resData: Array<RmvStationDto> = [
      {
        distance: 34,
        latitude: 50,
        longitude: 10,
        name: 'Frankfurt Hbf',
        products: 255,
        remoteId: 34343,
      },
    ]

    jest.spyOn(rmvService, 'getStations').mockImplementation(() => Promise.resolve(resData))
    // Act
    const res: Array<RmvStationDto> = await service.search('apiKey', 50, 10)
    // Assert
    expect(res).toBeDefined()
    expect(res.length).toBe(1)
    const firstLocation: RmvStationDto = res[0]
    expect(firstLocation.name).toBe('Frankfurt Hbf')
  })

  it('Add gas station', async () => {
    // Arrange
    const data: RmvStationDto = {
      distance: 34,
      latitude: 50,
      longitude: 10,
      name: 'Foo',
      products: 255,
      remoteId: 34343,
    }
    jest.spyOn(repo, 'insert').mockResolvedValueOnce(undefined)
    // Act
    await service.add(data)
    // Assert
    expect(repo.insert).toHaveBeenCalledTimes(1)
  })

  it('Save station', async () => {
    // Arrange
    const data: TimetableStationDto = {
      id: 'foo',
      name: 'Some City',
      nameOrigin: 'Some City Foo',
      remoteId: 42,
      sortNo: 99,
    }
    jest.spyOn(repo, 'update').mockResolvedValueOnce(undefined)
    // Act
    await service.save('foo', data)
    // Assert
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it('Delete station', async () => {
    // Arrange
    jest.spyOn(repo, 'delete').mockResolvedValueOnce(undefined)
    // Act
    await service.delete('foo')
    // Assert
    expect(repo.delete).toHaveBeenCalledTimes(1)
  })

  it('Load single station which exists', async () => {
    // Arrange
    const data: TimetableStationEntity = {
      id: 'foo',
      name: 'Some City',
      nameOrigin: 'Some City Foo',
      remoteId: 42,
      sortNo: 99,
    }
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(data)
    // Act
    const res: TimetableStationDto = await service.loadSingle('foo')
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.name).toBe(data.name)
  })

  it('Load single station which not exists', async () => {
    // Arrange
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined)
    // Act
    const res: TimetableStationDto = await service.loadSingle('foo')
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeNull()
  })

  it('Load all stations with existing', async () => {
    // Arrange
    const data: Array<TimetableStationEntity> = [
      {
        id: 'foo',
        name: 'Some City',
        nameOrigin: 'Some City Foo',
        remoteId: 42,
        sortNo: 99,
      },
    ]
    jest.spyOn(repo, 'find').mockResolvedValueOnce(data)
    // Act
    const res: Array<TimetableStationDto> = await service.loadAll()
    // Assert
    expect(repo.find).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(1)
    expect(res[0].nameOrigin).toBe(data[0].nameOrigin)
  })

  it('Load all stations with empty table', async () => {
    // Arrange
    jest.spyOn(repo, 'find').mockResolvedValueOnce([])
    // Act
    const res: Array<TimetableStationDto> = await service.loadAll()
    // Assert
    expect(repo.find).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(0)
  })

  it('Reorder stations', async () => {
    // Arrange
    const data: Array<SortOrderDto> = [
      {
        id: 'foo',
        sortNo: 8,
      },
      {
        id: 'bar',
        sortNo: 9,
      },
    ]
    jest.spyOn(repo, 'update').mockResolvedValue(undefined)
    // Act
    await service.reorderStations(data)
    // Assert
    expect(repo.update).toHaveBeenCalledTimes(data.length)
  })
})
