import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('CommonLocations')
export class CommonLocationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ length: 255 })
  public name!: string

  @Column({ length: 255 })
  public nameOrigin!: string

  @Column('double')
  public latitude!: number

  @Column('double')
  public longitude!: number

  @Column('int', { nullable: true })
  public sortNo!: number
}
