import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity('TimetableStations')
export class TimetableStationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string | null

  @Column({ length: 255 })
  public name!: string

  @Column({ length: 255 })
  public nameOrigin!: string

  @Column('int', { nullable: true })
  public sortNo!: number

  @Column('int')
  public remoteId!: number
}
