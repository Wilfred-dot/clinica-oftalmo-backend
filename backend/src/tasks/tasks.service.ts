import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async enviarLembretesConsultas() {
    this.logger.log('Verificando consultas para envio de lembretes...');
    const agora = new Date();
    const em24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

    // Busca consultas agendadas nas próximas 24h, incluindo médico e paciente
    const consultas = await this.prisma.consultas.findMany({
      where: {
        data_hora: {
          gte: agora,
          lte: em24Horas,
        },
        status: 'agendada',
      },
      include: {
        pacientes: { include: { users: true } },
        medicos: { include: { users: true } },
      },
    });

    for (const consulta of consultas) {
      // Verifica se já existe um lembrete recente para esta consulta
      const lembreteExistente = await this.prisma.notificacoes.findFirst({
        where: {
          paciente_id: consulta.paciente_id,
          tipo_variavel: 'lembrete_consulta',
          data_envio: {
            gte: new Date(agora.getTime() - 24 * 60 * 60 * 1000),
          },
        },
      });

      if (lembreteExistente) {
        continue; // já foi enviado lembrete recente, pula
      }

      const mensagem = `Lembrete: tem uma consulta agendada com Dr. ${consulta.medicos.users.name} amanhã às ${consulta.data_hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`;
      await this.prisma.notificacoes.create({
        data: {
          paciente_id: consulta.paciente_id,
          mensagem,
          tipo_variavel: 'lembrete_consulta',
          status_envio: 'pendente',
        },
      });
      this.logger.log(`Lembrete criado para consulta #${consulta.id}`);
    }
    this.logger.log(`Total de lembretes enviados: ${consultas.length}`);
  }
}
