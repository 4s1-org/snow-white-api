import { Test, TestingModule } from "@nestjs/testing"
import { CommonLocationsService } from "./common-locations.service"
import { IOpenStreetMapSearchRemoteResponse } from "../../../../remote-api-call/open-street-map/open-street-map-search.remote-response"
import { OpenStreetMapLocationDto } from "../../../../dataTransferObjects/open-street-map-location.dto"
import { CommonLocationEntity } from "../../../../entities/common-location.entity"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { OpenStreetMapService } from "../../../../remote-api-call/open-street-map/open-street-map.service"
import { RequestService } from "../../../../remote-api-call/request/request.service"
import { CommonLocationDto } from "../../../../dataTransferObjects/common-location.dto"
import { SortOrderDto } from "../../../../dataTransferObjects/sort-order.dto"

describe("CommonLocationsService", () => {
  let service: CommonLocationsService
  let repo: Repository<CommonLocationEntity>
  let requestService: RequestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonLocationsService,
        OpenStreetMapService,
        RequestService,
        {
          provide: getRepositoryToken(CommonLocationEntity),
          useClass: Repository,
        },
        {
          provide: RequestService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<CommonLocationsService>(CommonLocationsService)
    repo = module.get<Repository<CommonLocationEntity>>(
      getRepositoryToken(CommonLocationEntity),
    )
    requestService = module.get<RequestService>(RequestService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("Search a location", async () => {
    // Arrange
    const cities: Array<IOpenStreetMapSearchRemoteResponse> = [
      {
        boundingbox: [],
        class: "",
        display_name: "Some City",
        icon: "",
        importance: 0.333,
        lat: "42",
        licence: "",
        lon: "33",
        osm_type: "",
        place_id: 1,
        type: "",
      },
    ]
    jest
      .spyOn(requestService, "get")
      .mockImplementation(() => Promise.resolve(cities))
    // Act
    const res: Array<OpenStreetMapLocationDto> = await service.search("foo")
    // Assert
    expect(requestService.get).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(1)
    const firstLocation: OpenStreetMapLocationDto = res[0]
    expect(firstLocation.name).toBe("Some City")
  })

  it("Create location", async () => {
    // Arrange
    const data: OpenStreetMapLocationDto = {
      importance: 66.6,
      latitude: 50,
      longitude: 10,
      name: "Some City",
      remoteId: 1,
    }
    jest.spyOn(repo, "insert").mockResolvedValueOnce(undefined)
    // Act
    await service.add(data)
    // Assert
    expect(repo.insert).toHaveBeenCalledTimes(1)
  })

  it("Delete location", async () => {
    // Arrange
    jest.spyOn(repo, "delete").mockResolvedValueOnce(undefined)
    // Act
    await service.delete("foo")
    // Assert
    expect(repo.delete).toHaveBeenCalledTimes(1)
  })

  it("Load single location which exists", async () => {
    // Arrange
    const data: CommonLocationEntity = {
      id: "foo",
      latitude: 50,
      longitude: 10,
      name: "Some City",
      nameOrigin: "Some City Foo",
      sortNo: 99,
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(data)
    // Act
    const res: CommonLocationDto = await service.loadSingle("foo")
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.name).toBe(data.name)
  })

  it("Load single location which not exists", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(undefined)
    // Act
    const res: CommonLocationDto = await service.loadSingle("foo")
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeNull()
  })

  it("Load all locations with existing", async () => {
    // Arrange
    const data: Array<CommonLocationEntity> = [
      {
        id: "foo",
        latitude: 50,
        longitude: 10,
        name: "Some City",
        nameOrigin: "Some City Foo",
        sortNo: 99,
      },
    ]
    jest.spyOn(repo, "find").mockResolvedValueOnce(data)
    // Act
    const res: Array<CommonLocationDto> = await service.loadAll()
    // Assert
    expect(repo.find).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(1)
    expect(res[0].nameOrigin).toBe(data[0].nameOrigin)
  })

  it("Load all locations with empty table", async () => {
    // Arrange
    jest.spyOn(repo, "find").mockResolvedValueOnce([])
    // Act
    const res: Array<CommonLocationDto> = await service.loadAll()
    // Assert
    expect(repo.find).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(0)
  })

  it("Save location", async () => {
    // Arrange
    const data: CommonLocationDto = {
      id: "foo",
      latitude: 50,
      longitude: 10,
      name: "Some City",
      nameOrigin: "Some City Foo",
      sortNo: 8,
    }
    jest.spyOn(repo, "update").mockResolvedValueOnce(undefined)
    // Act
    await service.save("foo", data)
    // Assert
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it("Reorder locations", async () => {
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
    await service.reorderLocations(data)
    // Assert
    expect(repo.update).toHaveBeenCalledTimes(data.length)
  })

  // This was a bug while developing.
  it("SortNo should be less than max int size (2147483647)", async () => {
    // Arrange
    const data: OpenStreetMapLocationDto = {
      importance: 66.6,
      latitude: 50,
      longitude: 10,
      name: "Some City",
      remoteId: 1,
    }
    // Act
    jest
      .spyOn(repo, "insert")
      .mockImplementationOnce((entity: CommonLocationEntity) => {
        // Assert
        expect(entity.sortNo).toBeLessThan(2147483647)
        return undefined
      })
    // Act
    await service.add(data)
  })
})
