import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IRmvTripsDto } from '@4s1/snow-white-shared'
import { RmvTripDto } from './rmv-trip.dto'

// ToDo: Bessere Namen für RmvTripsDto und RmvTripDto wählen.
export class RmvTripsDto implements IRmvTripsDto {
  @IsNotEmpty()
  @ApiProperty()
  public text!: string

  @IsNotEmpty()
  @ApiProperty()
  public trips!: Array<RmvTripDto>
}
