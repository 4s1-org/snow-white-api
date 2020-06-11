import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { ISortOrderDto } from "@yellowgarbagebag/rest-api-dto"

export class SortOrderDto implements ISortOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  public id: string

  @IsNotEmpty()
  @ApiProperty()
  public sortNo: number
}
