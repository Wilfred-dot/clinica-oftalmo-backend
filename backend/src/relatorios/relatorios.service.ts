import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async consultasPorMedico(dataInicio?: string, dataFim?: string) {
    const where: any = {};
    if (dataInicio) where.data_hora = { gte: new Date(dataInicio) };
    if (dataFim) where.data_hora = { ...where.data_hora, lte: new Date(dataFim) };

    const resultado = await this.prisma.consultas.groupBy({
      by: ['medico_id'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const medicoIds = resultado.map(r => r.medico_id);
    const medicos = await this.prisma.medicos.findMany({
      where: { id: { in: medicoIds } },
      include: { users: { select: { name: true } } },
    });

    return resultado.map(r => ({
      medico_id: r.medico_id,
      nome: medicos.find(m => m.id === r.medico_id)?.users?.name || 'Desconhecido',
      total_consultas: r._count.id,
    }));
  }

  async diagnosticosMaisComuns() {
    const consultas = await this.prisma.consultas.findMany({
      where: { status: 'realizada', observacoes: { not: null } },
      select: { observacoes: true },
    });

    const contagem: Record<string, number> = {};
    for (const c of consultas) {
      try {
        const clinico = JSON.parse(c.observacoes || '{}');
        const diag = clinico.diagnostico?.trim();
        if (diag) contagem[diag] = (contagem[diag] || 0) + 1;
      } catch { /* ignora */ }
    }

    return Object.entries(contagem)
      .map(([diagnostico, total]) => ({ diagnostico, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }

  async resumoGeral() {
    const [totalConsultas, totalPacientes, totalMedicos, consultasRealizadas] = await Promise.all([
      this.prisma.consultas.count(),
      this.prisma.pacientes.count(),
      this.prisma.medicos.count(),
      this.prisma.consultas.count({ where: { status: 'realizada' } }),
    ]);

    return {
      total_consultas: totalConsultas,
      total_pacientes: totalPacientes,
      total_medicos: totalMedicos,
      consultas_realizadas: consultasRealizadas,
      taxa_conclusao: totalConsultas > 0 ? ((consultasRealizadas / totalConsultas) * 100).toFixed(2) + '%' : '0%',
    };
  }
}
