import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ISortOrderDto } from '@yellowgarbagebag/snow-white-shared'

export class SortOrderDto implements ISortOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  public id!: string

  @IsNotEmpty()
  @ApiProperty()
  public sortNo!: number
}
