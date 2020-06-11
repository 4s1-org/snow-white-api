import { Test, TestingModule } from "@nestjs/testing"
import { DateSettingsService } from "./date-settings.service"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { DateSettingsEntity } from "../../../../entities/date-settings.entity"
import { DateSettingsDto } from "../../../../dataTransferObjects/date-settings.dto"

describe("DateSettingsService", () => {
  let service: DateSettingsService
  let repo: Repository<DateSettingsEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DateSettingsService,
        {
          provide: getRepositoryToken(DateSettingsEntity),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<DateSettingsService>(DateSettingsService)
    repo = module.get<Repository<DateSettingsEntity>>(
      getRepositoryToken(DateSettingsEntity),
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("save when no record is present should create a new record", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(undefined)
    jest.spyOn(repo, "insert").mockResolvedValueOnce(undefined)
    jest.spyOn(repo, "update").mockResolvedValueOnce(undefined)

    const data: DateSettingsEntity = {
      fontSize: 12,
      id: "foo",
      isActive: true,
      pattern: "bar",
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
    const existingData: DateSettingsEntity = {
      fontSize: 12,
      id: "foo",
      isActive: true,
      pattern: "bar",
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(existingData)
    jest.spyOn(repo, "update").mockResolvedValueOnce(undefined)

    const data: DateSettingsEntity = {
      fontSize: 12,
      id: "foo",
      isActive: true,
      pattern: "bar",
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
    const res: DateSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.insert).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.pattern).toBe("DD.MM.YYYY HH:mm:ss") // this is the default value
  })

  it("load when record is present should return existing record", async () => {
    // Arrange
    const existingData: DateSettingsEntity = {
      fontSize: 12,
      id: "foo",
      isActive: true,
      pattern: "bar",
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(existingData)
    // Act
    const res: DateSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.pattern).toBe("bar")
  })
})
