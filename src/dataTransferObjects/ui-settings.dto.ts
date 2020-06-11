import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IUiSettingsDto } from "@yellowgarbagebag/rest-api-dto"

export class UiSettingsDto implements IUiSettingsDto {
  @IsNotEmpty()
  @ApiProperty()
  public traffic: {
    isActive: boolean
  }

  @IsNotEmpty()
  @ApiProperty()
  public date: {
    isActive: boolean
    fontSize: number
  }

  @IsNotEmpty()
  @ApiProperty()
  public weather: {
    isActive: boolean
  }

  @IsNotEmpty()
  @ApiProperty()
  public timetable: {
    isActive: boolean
  }

  @IsNotEmpty()
  @ApiProperty()
  public fuelPrice: {
    isActive: boolean
    showE5: boolean
    showE10: boolean
    showDiesel: boolean
    interval: number
  }
}
