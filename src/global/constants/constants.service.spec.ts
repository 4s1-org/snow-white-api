import { Test, TestingModule } from '@nestjs/testing'
import { ConstantsService } from './constants.service'

describe('ConstantsService', () => {
  let service: ConstantsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstantsService],
    }).compile()

    service = module.get<ConstantsService>(ConstantsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('getTimestamp', () => {
    // Act
    const timestamp: number = service.getCurrentTimestamp()
    // Assert
    expect(timestamp).toBeGreaterThanOrEqual(0)
    expect(timestamp).toBeLessThan(24 * 3600)
  })
})
