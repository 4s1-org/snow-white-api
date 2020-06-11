import { Injectable } from "@nestjs/common"

@Injectable()
export class ConstantsService {
  public readonly hiddenValue: "**********" = "**********"

  public getCurrentTimestamp(): number {
    const date: Date = new Date()
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
  }
}
