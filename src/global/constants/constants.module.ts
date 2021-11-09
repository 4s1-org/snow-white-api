import { Module, Global } from '@nestjs/common'
import { ConstantsService } from './constants.service'

@Global()
@Module({
  exports: [ConstantsService],
  providers: [ConstantsService],
})
export class ConstantsModule {}
