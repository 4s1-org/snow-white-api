import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('FuelPriceStations')
export class FuelPriceStationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ length: 255 })
  public name!: string

  @Column({ length: 255 })
  public nameOrigin!: string

  @Column('int')
  public latitude!: number

  @Column('int')
  public longitude!: number

  @Column('int', { nullable: true })
  public sortNo!: number

  @Column({ type: 'uuid', length: 36 })
  public remoteId!: string
}
