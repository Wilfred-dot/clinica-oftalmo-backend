import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { MedicosModule } from './medicos/medicos.module';
import { ConsultasModule } from './consultas/consultas.module';
import { PrescricoesModule } from './prescricoes/prescricoes.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { InternacoesModule } from './internacoes/internacoes.module';
import { TasksModule } from './tasks/tasks.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PacientesModule,
    MedicosModule,
    ConsultasModule,
    PrescricoesModule,
    NotificacoesModule,
    InternacoesModule,
    TasksModule,
    RelatoriosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
