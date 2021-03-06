import { Controller, Get, Param, Logger } from '@nestjs/common'
import { connect, MqttClient } from 'mqtt'
import path from 'path'
import { ProcessEnv } from '../process-env'
import { StockCourseDto } from './stock-course.dto'

@Controller('stock')
export class StockController {
  private cache: StockCourseDto[] = []
  private client: MqttClient | undefined = undefined
  private readonly logger = new Logger('StockController')

  constructor() {
    if (ProcessEnv.MQTT_SERVER) {
      this.client = connect(`mqtts://${ProcessEnv.MQTT_SERVER}`, {
        port: ProcessEnv.MQTT_PORT,
        username: ProcessEnv.MQTT_USERNAME,
        password: ProcessEnv.MQTT_PASSWORD,
        rejectUnauthorized: false,
      })

      this.client.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString())
          this.buildCache(topic, data)
        } catch {
          this.logger.error(`Can't parse payload "${payload.toString()}" of topix ${topic}.`)
        }
      })

      this.client.subscribe(path.join(ProcessEnv.MQTT_TOPIC_STOCK, '+'))
    }
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
  public loadSingleIsin(@Param('isin') isin: string): any {
    const stock = this.cache.find((x) => x.isin === isin)
    if (stock) {
      this.logger.log(`${isin} | found in cache`)
      return stock
    } else {
      this.logger.warn(`${isin} | not found in cache`)
      const newStock = new StockCourseDto()
      newStock.isin = isin
      if (this.client) {
        this.logger.log(`${isin} | added to cache`)
        this.client.publish(path.join(ProcessEnv.MQTT_TOPIC_STOCK, newStock.isin), JSON.stringify(newStock), { retain: true })
      }
      return newStock
    }
  }
}
