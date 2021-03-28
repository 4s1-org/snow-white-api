import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('DateSettings')
export class DateSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column()
  public isActive!: boolean

  @Column({ length: 255 })
  public pattern!: string

  @Column()
  public fontSize!: number
}
