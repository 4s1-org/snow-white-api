import { Module, HttpModule } from '@nestjs/common'
import { OpenWeatherService } from './open-weather/open-weather.service'
import { RmvService } from './rmv/rmv.service'
import { HereService } from './here/here.service'
import { RequestService } from './request/request.service'
import { OpenStreetMapService } from './open-street-map/open-street-map.service'
import { TankerkoenigService } from './tankerkoenig/tankerkoenig.service'

@Module({
  controllers: [],
  exports: [OpenStreetMapService, TankerkoenigService, HereService, RmvService, OpenWeatherService],
  imports: [HttpModule],
  providers: [OpenStreetMapService, TankerkoenigService, RmvService, HereService, RequestService, OpenWeatherService],
})
export class RemoteApiCallModule {}
