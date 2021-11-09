import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { CommonLocationEntity } from './common-location.entity'

@Entity('WeatherSettings')
export class WeatherSettingsEntity {
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
  public commonLocation!: CommonLocationEntity | null
}
