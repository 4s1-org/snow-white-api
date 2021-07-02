import { Controller, Get, Param } from '@nestjs/common'

@Controller('stock')
export class StockController {
  @Get('/:id')
  public loadSingleStation(@Param('id') id: string): any {
    const res = {
      foo: id,
    }
    return res
  }
}
