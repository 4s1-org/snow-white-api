import { Module, HttpModule } from '@nestjs/common'
import { OpenWeatherService } from './open-weather/open-weather.service.js'
import { RmvService } from './rmv/rmv.service.js'
import { HereService } from './here/here.service.js'
import { RequestService } from './request/request.service.js'
import { OpenStreetMapService } from './open-street-map/open-street-map.service.js'
import { TankerkoenigService } from './tankerkoenig/tankerkoenig.service.js'

@Module({
  controllers: [],
  exports: [OpenStreetMapService, TankerkoenigService, HereService, RmvService, OpenWeatherService],
  imports: [HttpModule],
  providers: [OpenStreetMapService, TankerkoenigService, RmvService, HereService, RequestService, OpenWeatherService],
})
export class RemoteApiCallModule {}
