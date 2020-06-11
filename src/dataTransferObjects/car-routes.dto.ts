import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { ICarRoutesDto, ICarRouteDto } from "@yellowgarbagebag/rest-api-dto"

// ToDo: Bessere Namen für CarRoutesDto und CarRouteDto wählen.
export class CarRoutesDto implements ICarRoutesDto {
  @IsNotEmpty()
  @ApiProperty()
  public text: string

  @IsNotEmpty()
  @ApiProperty()
  public routes: Array<ICarRouteDto>
}
