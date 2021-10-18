/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { CommonLocation, Prisma } from '../generated/prisma.js'

@Injectable()
export class CommonLocationDbService {
  constructor(private prisma: PrismaService) {}

  public read(CommonLocationWhereUniqueInput: Prisma.CommonLocationWhereUniqueInput): Promise<CommonLocation | null> {
    return this.prisma.commonLocation.findUnique({
      where: CommonLocationWhereUniqueInput,
    })
  }

  public readAll() {
    return this.prisma.commonLocation.findMany()
  }

  public async createCommonLocation(data: Prisma.CommonLocationCreateInput): Promise<CommonLocation> {
    return this.prisma.commonLocation.create({
      data,
    })
  }

  public async update(params: { where: Prisma.CommonLocationWhereUniqueInput; data: Prisma.CommonLocationUpdateInput }) {
    const { data, where } = params
    return this.prisma.commonLocation.update({
      data,
      where,
    })
  }

  public async delete(where: Prisma.CommonLocationWhereUniqueInput) {
    return this.prisma.commonLocation.delete({
      where,
    })
  }
}
