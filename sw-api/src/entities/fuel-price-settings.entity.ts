import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('FuelPriceSettings')
export class FuelPriceSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column()
  public isActive!: boolean

  @Column({ length: 255 })
  public apiKey!: string

  @Column()
  public showE5!: boolean

  @Column()
  public showE10!: boolean

  @Column()
  public showDiesel!: boolean

  @Column()
  public interval!: number
}
