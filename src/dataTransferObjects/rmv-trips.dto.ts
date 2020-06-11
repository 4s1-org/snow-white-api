import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IRmvTripsDto } from "@yellowgarbagebag/rest-api-dto"
import { RmvTripDto } from "./rmv-trip.dto"

// ToDo: Bessere Namen für RmvTripsDto und RmvTripDto wählen.
export class RmvTripsDto implements IRmvTripsDto {
  @IsNotEmpty()
  @ApiProperty()
  public text: string

  @IsNotEmpty()
  @ApiProperty()
  public trips: Array<RmvTripDto>
}
