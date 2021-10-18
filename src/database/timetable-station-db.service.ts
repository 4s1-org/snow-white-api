/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { TimetableStation, Prisma } from '../generated/prisma/index.js'

@Injectable()
export class TimetableStationDbService {
  constructor(private prisma: PrismaService) {}

  public async readTimetableStation(
    TimetableStationWhereUniqueInput: Prisma.TimetableStationWhereUniqueInput,
  ): Promise<TimetableStation | null> {
    return this.prisma.timetableStation.findUnique({
      where: TimetableStationWhereUniqueInput,
    })
  }

  public async readTimetableStations(params: {
    skip?: number
    take?: number
    cursor?: Prisma.TimetableStationWhereUniqueInput
    where?: Prisma.TimetableStationWhereInput
  }): Promise<TimetableStation[]> {
    const { skip, take, cursor, where } = params
    return this.prisma.timetableStation.findMany({
      skip,
      take,
      cursor,
      where,
    })
  }

  public async createTimetableStation(data: Prisma.TimetableStationCreateInput): Promise<TimetableStation> {
    return this.prisma.timetableStation.create({
      data,
    })
  }

  public async updateTimetableStation(params: {
    where: Prisma.TimetableStationWhereUniqueInput
    data: Prisma.TimetableStationUpdateInput
  }): Promise<TimetableStation> {
    const { data, where } = params
    return this.prisma.timetableStation.update({
      data,
      where,
    })
  }

  public async deleteTimetableStation(where: Prisma.TimetableStationWhereUniqueInput): Promise<TimetableStation> {
    return this.prisma.timetableStation.delete({
      where,
    })
  }
}
