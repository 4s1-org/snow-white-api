/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { Prisma } from '../generated/prisma.js'

@Injectable()
export class DateSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async readFirstRecord() {
    const record = await this.prisma.dateSetting.findFirst()

    if (record) {
      return record
    } else {
      return this.createDummyRecord()
    }
  }

  private createDummyRecord() {
    return this.prisma.dateSetting.create({
      data: {
        fontSize: 12,
        isActive: true,
        pattern: 'DD.MM.YYYY HH:mm:ss',
      },
    })
  }

  public async update(params: { data: Prisma.DateSettingUpdateInput }) {
    const { data } = params
    const record = await this.readFirstRecord()
    return this.prisma.dateSetting.update({
      data,
      where: { id: record.id },
    })
  }
}
