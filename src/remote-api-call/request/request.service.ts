import { Injectable, HttpService, Logger } from '@nestjs/common'
import { AxiosResponse } from 'axios'

interface ICacheEntry {
  date: number
  responseData: any
  urlBegin: string
}

@Injectable()
export class RequestService {
  private readonly logger: Logger = new Logger(RequestService.name)

  private cache: Array<ICacheEntry> = []

  constructor(private readonly httpService: HttpService) {}

  public async get<T>(url: string, parameter?: Array<string>): Promise<T> {
    if (parameter) {
      url += `?${parameter.join('&')}`
    }

    const dtNow: number = Date.now()
    // Remove old entries
    this.cache = this.cache.filter((entry: ICacheEntry) => entry.date > dtNow - 3000) // 3 seconds cache

    const urlBegin: string = url.substr(0, 40)
    // Find existing cache entries
    const cachedEntries: Array<ICacheEntry> = this.cache.filter((entry: ICacheEntry) => entry.urlBegin === urlBegin)
    // If any found, send cached value back
    if (cachedEntries.length > 0) {
      this.logger.warn('Response with cached value')
      return cachedEntries[0].responseData
    }

    this.logger.log('GET request - ' + url)
    const response = await this.httpService.get<T>(url).toPromise()

    this.cache.push({
      date: dtNow,
      responseData: response!.data,
      urlBegin,
    })

    return response!.data
  }
}
