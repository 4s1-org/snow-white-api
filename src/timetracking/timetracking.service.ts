import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '../config/config.service'
import moment from 'moment'
import 'moment-timezone'

@Injectable()
export class TimetrackingService {
  constructor(private readonly config: ConfigService) {}

  public sendEmail(): string {
    const time = moment().tz('Europe/Berlin').format('DD.MM.YYYY - HH:mm:ss') + ' Uhr'

    const transporter: any = nodemailer.createTransport({
      auth: {
        pass: this.config.get('SMTP_PASSWORD'),
        user: this.config.get('SMTP_USER'),
      },
      host: this.config.get('SMTP_HOST'),
      port: 465,
      secure: true,
    })

    transporter.sendMail({
      from: this.config.get('SMTP_USER'),
      subject: 'Zeiterfassung',
      text: `Hallo Steffen,\n\nfolgender Zeitstempel ist für dich: ${time}\n\nBeste Grüsse\nDeine API`,
      to: this.config.get('APP_TIMETRACKING_RECEIVER'),
    })

    return time
  }
}
