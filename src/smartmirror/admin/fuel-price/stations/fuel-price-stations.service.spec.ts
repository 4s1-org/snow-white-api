import { Test, TestingModule } from "@nestjs/testing"
import { FuelPriceStationsService } from "./fuel-price-stations.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FuelPriceStationEntity } from "../../../../entities/fuel-price-station.entity"
import { TankerkoenigStationDto } from "../../../../dataTransferObjects/tankerkoenig-station.dto"
import { TankerkoenigService } from "../../../../remote-api-call/tankerkoenig/tankerkoenig.service"
import { FuelPriceStationDto } from "../../../../dataTransferObjects/fuel-price-station.dto"
import { SortOrderDto } from "../../../../dataTransferObjects/sort-order.dto"

describe("FuelPriceStationsService", () => {
  let service: FuelPriceStationsService
  let tankerkoenigService: TankerkoenigService
  let repo: Repository<FuelPriceStationEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuelPriceStationsService,
        {
          provide: getRepositoryToken(FuelPriceStationEntity),
          useClass: Repository,
        },
        {
          provide: TankerkoenigService,
          useValue: {
            searchStations: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<FuelPriceStationsService>(FuelPriceStationsService)
    repo = module.get<Repository<FuelPriceStationEntity>>(
      getRepositoryToken(FuelPriceStationEntity),
    )
    tankerkoenigService = module.get<TankerkoenigService>(TankerkoenigService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("Search gas station", async () => {
    // Arrange
    const resData: Array<TankerkoenigStationDto> = [
      {
        brand: "none",
        city: "Some City",
        houseNumber: "2a",
        latitude: 50,
        longitude: 10,
        name: "Tankhof",
        postCode: 34,
        remoteId: "foo",
        street: "Mainstreet",
      },
    ]

    jest
      .spyOn(tankerkoenigService, "searchStations")
      .mockImplementation(() => Promise.resolve(resData))
    // Act
    const res: Array<TankerkoenigStationDto> = await service.search("apiKey", {
      latitude: 50,
      longitude: 10,
    })
    // Assert
    expect(res).toBeDefined()
    expect(res.length).toBe(1)
    const firstLocation: TankerkoenigStationDto = res[0]
    expect(firstLocation.name).toBe("Tankhof")
  })

  it("Add gas station", async () => {
    // Arrange
    const data: TankerkoenigStationDto = {
      brand: "none",
      city: "Some City",
      houseNumber: "2a",
      latitude: 50,
      longitude: 10,
      name: "Tankhof",
      postCode: 34,
      remoteId: "foo",
      street: "Mainstreet",
    }
    jest.spyOn(repo, "insert").mockResolvedValueOnce(undefined)
    // Act
    await service.add(data)
    // Assert
    expect(repo.insert).toHaveBeenCalledTimes(1)
  })

  it("Find all gas stations", async () => {
    // Arrange
    const data: Array<FuelPriceStationEntity> = [
      {
        id: "foo",
        latitude: 50,
        longitude: 10,
        name: "Tankhof",
        nameOrigin: "Tankhof",
        remoteId: "foo",
        sortNo: 1,
      },
    ]
    jest.spyOn(repo, "find").mockResolvedValueOnce(data)
    // Act
    const res: Array<FuelPriceStationEntity> = await service.findAll()
    // Assert
    expect(repo.find).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(1)
    expect(res[0].name).toBe("Tankhof")
  })

  it("Save station", async () => {
    // Arrange
    const data: FuelPriceStationDto = {
      id: "foo",
      latitude: 50,
      longitude: 10,
      name: "Some City",
      nameOrigin: "Some City Foo",
      remoteId: "foo",
      sortNo: 8,
    }
    jest.spyOn(repo, "update").mockResolvedValueOnce(undefined)
    // Act
    await service.save("foo", data)
    // Assert
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it("Delete station", async () => {
    // Arrange
    jest.spyOn(repo, "delete").mockResolvedValueOnce(undefined)
    // Act
    await service.delete("foo")
    // Assert
    expect(repo.delete).toHaveBeenCalledTimes(1)
  })

  it("Load single gas station which exists", async () => {
    // Arrange
    const data: FuelPriceStationEntity = {
      id: "foo",
      latitude: 50,
      longitude: 10,
      name: "Some City",
      nameOrigin: "Some City Foo",
      remoteId: "bar",
      sortNo: 99,
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(data)
    // Act
    const res: FuelPriceStationDto = await service.loadSingle("foo")
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.name).toBe(data.name)
  })

  it("Load single gas station which not exists", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(undefined)
    // Act
    const res: FuelPriceStationDto = await service.loadSingle("foo")
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeNull()
  })

  it("Load all gas stations with existing", async () => {
    // Arrange
    const data: Array<FuelPriceStationEntity> = [
      {
        id: "foo",
        latitude: 50,
        longitude: 10,
        name: "Some City",
        nameOrigin: "Some City Foo",
        remoteId: "bar",
        sortNo: 99,
      },
    ]
    jest.spyOn(repo, "find").mockResolvedValueOnce(data)
    // Act
    const res: Array<FuelPriceStationDto> = await service.loadAll()
    // Assert
    expect(repo.find).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(1)
    expect(res[0].nameOrigin).toBe(data[0].nameOrigin)
  })

  it("Load all gas stations with empty table", async () => {
    // Arrange
    jest.spyOn(repo, "find").mockResolvedValueOnce([])
    // Act
    const res: Array<FuelPriceStationDto> = await service.loadAll()
    // Assert
    expect(repo.find).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(0)
  })

  it("Reorder gas stations", async () => {
    // Arrange
    const data: Array<SortOrderDto> = [
      {
        id: "foo",
        sortNo: 8,
      },
      {
        id: "bar",
        sortNo: 9,
      },
    ]
    jest.spyOn(repo, "update").mockResolvedValue(undefined)
    // Act
    await service.reorderGasStations(data)
    // Assert
    expect(repo.update).toHaveBeenCalledTimes(data.length)
  })
})
