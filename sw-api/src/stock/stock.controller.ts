import { Controller, Get, Param, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller('stock')
export class StockController {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.client.connect()
  }

  @Get('/:isin')
  public loadSingleStation(@Param('isin') isin: string): any {
    const res = {
      foo: isin,
    }
    this.client.emit<void, any>(`snowwhite/event/stock/${isin}`, Date.now)
    return res
  }
}
