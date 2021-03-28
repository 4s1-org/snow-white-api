import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IRmvTripDto } from '@yellowgarbagebag/snow-white-dto'

export class RmvTripDto implements IRmvTripDto {
  @IsNotEmpty()
  @ApiProperty()
  public tripId: string

  @IsNotEmpty()
  @ApiProperty()
  public arrivalTimePlanned: number

  @IsNotEmpty()
  @ApiProperty()
  public arrivalTimeReal: number

  @IsNotEmpty()
  @ApiProperty()
  public startTimePlanned: number

  @IsNotEmpty()
  @ApiProperty()
  public startTimeReal: number

  @IsNotEmpty()
  @ApiProperty()
  public trackPlanned: string

  @IsNotEmpty()
  @ApiProperty()
  public trackReal: string

  @IsNotEmpty()
  @ApiProperty()
  public durationPlanned: number

  @IsNotEmpty()
  @ApiProperty()
  public durationReal: number

  @IsNotEmpty()
  @ApiProperty()
  public lines: Array<string>
}
