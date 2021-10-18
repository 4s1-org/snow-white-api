import { Module, Global } from '@nestjs/common'
import { ConfigService } from './config.service.js'

// ToDo: In den Global Ordner verschieben
@Global()
@Module({
  exports: [ConfigService],
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(),
    },
  ],
})
export class ConfigModule {}
