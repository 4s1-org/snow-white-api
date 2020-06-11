import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { ICommonSettingsDto } from "@yellowgarbagebag/rest-api-dto"

export class CommonSettingsDto implements ICommonSettingsDto {
  @IsNotEmpty()
  @ApiProperty()
  public morningStart: number

  @IsNotEmpty()
  @ApiProperty()
  public morningEnd: number
}
