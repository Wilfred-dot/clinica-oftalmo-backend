import { Module } from '@nestjs/common';
import { PrescricoesService } from './prescricoes.service';
import { PrescricoesController } from './prescricoes.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PrescricoesController],
  providers: [PrescricoesService],
})
export class PrescricoesModule {}
