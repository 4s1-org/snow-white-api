import { Controller, Get, Param, Logger } from '@nestjs/common'
import { connect, MqttClient } from 'mqtt'
import { StockCourseDto } from './stock-course.dto'

@Controller('stock')
export class StockController {
  private cache: StockCourseDto[] = []
  private client2: MqttClient
  private readonly logger = new Logger('Foo')

  constructor() {
    this.client2 = connect('mqtts://192.168.0.1', {
      port: 8883,
      username: 'username',
      password: 'password',
      rejectUnauthorized: false,
    })

    this.client2.on('message', (topic, payload) => {
      this.buildCache(topic, JSON.parse(payload.toString()))
    })

    this.client2.subscribe('snowwhite/stock/+')
  }

  async onApplicationBootstrap(): Promise<void> {
    //
  }

  private isLetter(str: string): boolean {
    return str.length === 1 && 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(str)
  }

  private isIsin(isin: string): boolean {
    return isin.length === 12 && this.isLetter(isin.charAt(0)) && this.isLetter(isin.charAt(1))
  }

  public buildCache(topic: string, stock: StockCourseDto): void {
    const parts = topic.split('/')
    const isin = parts[parts.length - 1]

    if (!this.isIsin(isin)) {
      this.logger.error(`${isin} | invalid ISIN`)
      return
    }

    if (!stock.lastUpdate) {
      stock.lastUpdate = 1
    }
    if (!stock.isin) {
      stock.isin = isin
    }

    this.logger.log(`${isin} | insert/update cache`)

    // Remove from cache
    this.cache = this.cache.filter((x) => x.isin !== isin)
    // Add to cache
    this.cache.push(stock)
    this.logger.log(`Cache contains ${this.cache.length} item(s)`)
  }

  @Get('/:isin')
  public loadSingleStation(@Param('isin') isin: string): any {
    const stock = this.cache.find((x) => x.isin === isin)
    if (stock) {
      this.logger.log(`${isin} | found in cache`)
      return stock
    } else {
      this.logger.warn(`${isin} | not found in cache`)
      const stock = new StockCourseDto()
      stock.isin = isin
      this.client2.publish(`snowwhite/stock/${stock.isin}`, JSON.stringify(stock), { retain: true })
      return stock
    }
  }
}
