import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import {
  IWeatherDatasDto,
  IWeatherDataDto,
} from "@yellowgarbagebag/rest-api-dto"

export class WeatherDatasDto implements IWeatherDatasDto {
  @IsNotEmpty()
  @ApiProperty()
  public name: string

  @IsNotEmpty()
  @ApiProperty()
  public infos: Array<IWeatherDataDto>
}
