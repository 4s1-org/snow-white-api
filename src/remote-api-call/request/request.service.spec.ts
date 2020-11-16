import { Test, TestingModule } from '@nestjs/testing'
import { RequestService } from './request.service'
import { HttpModule } from '@nestjs/common'

// ToDo: Implement tests
describe('RequestService', () => {
  let service: RequestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [RequestService],
    }).compile()

    service = module.get<RequestService>(RequestService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
