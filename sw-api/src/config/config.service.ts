import * as dotenv from 'dotenv'

export class ConfigService {
  private readonly envConfig: { [key: string]: string }

  constructor() {
    dotenv.config()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.envConfig = process.env
  }

  public get(key: string): any {
    return this.envConfig[key]
  }
}
