import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { TimetableStationEntity } from './timetable-station.entity.js'

@Entity('TimetableSettings')
export class TimetableSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column()
  public isActive!: boolean

  @Column({ length: 255 })
  public apiKey!: string

  @ManyToOne(/* istanbul ignore next */ () => TimetableStationEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  public timetableStationFrom!: TimetableStationEntity | null

  @ManyToOne(/* istanbul ignore next */ () => TimetableStationEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  public timetableStationTo!: TimetableStationEntity | null

  @Column('int')
  public maxChanges!: number

  @Column()
  public showICE!: boolean

  @Column()
  public showIC!: boolean

  @Column()
  public showBus!: boolean

  @Column()
  public showTram!: boolean

  @Column()
  public showSBahn!: boolean

  @Column()
  public showRE!: boolean

  @Column()
  public showRB!: boolean

  @Column()
  public showUBahn!: boolean
}
