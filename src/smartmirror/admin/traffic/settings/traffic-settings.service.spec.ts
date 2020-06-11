import { Test, TestingModule } from "@nestjs/testing"
import { TrafficSettingsService } from "./traffic-settings.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { TrafficSettingsEntity } from "../../../../entities/traffic-settings.entity"
import { Repository } from "typeorm"
import { TrafficSettingsDto } from "../../../../dataTransferObjects/traffic-settings.dto"
import { CommonLocationEntity } from "../../../../entities/common-location.entity"
import { ConstantsService } from "../../../../global/constants/constants.service"

describe("TrafficSettingsService", () => {
  let service: TrafficSettingsService
  let constants: ConstantsService
  let repo: Repository<TrafficSettingsEntity>

  const someLocation: CommonLocationEntity = Object.freeze({
    id: "abc",
    latitude: 30,
    longitude: 10,
    name: "foo",
    nameOrigin: "foobar",
    sortNo: 1,
  })
  const someSettingEntity: TrafficSettingsEntity = Object.freeze({
    apiKey: "apikey",
    commonLocationFrom: someLocation,
    commonLocationTo: someLocation,
    id: "foo",
    isActive: true,
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficSettingsService,
        ConstantsService,
        {
          provide: getRepositoryToken(TrafficSettingsEntity),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<TrafficSettingsService>(TrafficSettingsService)
    constants = module.get<ConstantsService>(ConstantsService)
    repo = module.get<Repository<TrafficSettingsEntity>>(
      getRepositoryToken(TrafficSettingsEntity),
    )
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("save when no record is present should create a new record", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(undefined)
    jest.spyOn(repo, "insert").mockResolvedValueOnce(undefined)
    jest.spyOn(repo, "update").mockResolvedValueOnce(undefined)

    const data: TrafficSettingsDto = {
      apiKey: "foo",
      isActive: true,
      locationFromId: "abc",
      locationToId: "def",
    }
    // Act
    await service.save(data)
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.insert).toHaveBeenCalledTimes(1)
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it("save when record is present should update existing record", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(someSettingEntity)
    jest.spyOn(repo, "update").mockResolvedValueOnce(undefined)

    const data: TrafficSettingsDto = {
      apiKey: "foo",
      isActive: true,
      locationFromId: "xyz",
      locationToId: "uvw",
    }
    // Act
    await service.save(data)
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it("load when no record is present should create a new record", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(undefined)
    jest.spyOn(repo, "insert").mockResolvedValueOnce(undefined)
    // Act
    const res: TrafficSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.insert).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.isActive).toBe(false) // this is the default value
  })

  it("load when record is present should return existing record", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(someSettingEntity)
    // Act
    const res: TrafficSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.apiKey).toBe("apik" + constants.hiddenValue)
  })
})
