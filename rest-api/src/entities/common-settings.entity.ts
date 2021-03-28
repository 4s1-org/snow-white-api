import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('CommonSettings')
export class CommonSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column('int')
  public morningStart: number

  @Column('int')
  public morningEnd: number
}
