import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { CommonLocationEntity } from './common-location.entity.js'

@Entity('TrafficSettings')
export class TrafficSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column()
  public isActive!: boolean

  @Column({ length: 255 })
  public apiKey!: string

  @ManyToOne(/* istanbul ignore next */ () => CommonLocationEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  public commonLocationFrom!: CommonLocationEntity | null

  @ManyToOne(/* istanbul ignore next */ () => CommonLocationEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  public commonLocationTo!: CommonLocationEntity | null
}
