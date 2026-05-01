import { Module } from '@nestjs/common';
import { InternacoesService } from './internacoes.service';
import { InternacoesController } from './internacoes.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [InternacoesController],
  providers: [InternacoesService],
})
export class InternacoesModule {}
