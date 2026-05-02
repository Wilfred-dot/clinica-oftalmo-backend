import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePacienteDto) {
    const existUser = await this.prisma.users.findUnique({ where: { email: dto.email } });
    if (existUser) throw new ConflictException('Email já existe');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
      data: { name: dto.name, email: dto.email, password: hash, role: 'paciente' },
    });
    return this.prisma.pacientes.create({
      data: {
        user_id: user.id,
        data_nascimento: new Date(dto.data_nascimento),
        sexo: dto.sexo,
        telefone: dto.telefone,
        endereco: dto.endereco,
        historico_medico: dto.historico_medico,
      },
      include: { users: { select: { id: true, name: true, email: true, ativo: true } } },
    });
  }

  async findAll(search?: string) {
    const where: any = {};
    if (search) where.users = { name: { contains: search, mode: 'insensitive' } };
    const pacientes = await this.prisma.pacientes.findMany({
      where,
      include: {
        users: { select: { id: true, name: true, email: true, ativo: true } },
        consultas: { orderBy: { data_hora: 'desc' }, take: 1 },
      },
    });
    return pacientes.map(p => ({
      ...p,
      ultimo_atendimento: p.consultas.length > 0 ? p.consultas[0].data_hora : null,
      consultas: undefined,
    }));
  }

  async findOne(id: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id },
      include: { users: { select: { id: true, name: true, email: true, ativo: true } } },
    });
    if (!paciente) throw new NotFoundException('Paciente não encontrado');
    return paciente;
  }

  async findByUserId(userId: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { user_id: userId },
      include: { users: { select: { id: true, name: true, email: true, ativo: true } } },
    });
    if (!paciente) throw new NotFoundException('Paciente não encontrado');
    return paciente;
  }

  async update(id: number, dto: UpdatePacienteDto) {
    const paciente = await this.findOne(id);
    if (dto.email && paciente.users) {
      await this.prisma.users.update({ where: { id: paciente.user_id }, data: { email: dto.email } });
    }
    return this.prisma.pacientes.update({
      where: { id },
      data: {
        data_nascimento: dto.data_nascimento ? new Date(dto.data_nascimento) : undefined,
        sexo: dto.sexo,
        telefone: dto.telefone,
        endereco: dto.endereco,
        historico_medico: dto.historico_medico,
      },
      include: { users: { select: { id: true, name: true, email: true, ativo: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.pacientes.delete({ where: { id } });
    return { message: 'Paciente removido' };
  }

  // ─── NOVO: histórico do paciente ──────────────
  async getHistorico(id: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true, ativo: true } },
        consultas: {
          orderBy: { data_hora: 'desc' },
          include: {
            medicos: { include: { users: { select: { name: true } } } },
            prescricoes: true,
          },
        },
      },
    });
    if (!paciente) throw new NotFoundException('Paciente não encontrado');

    // Mapear consultas para incluir diagnóstico extraído do JSON
    const consultasFormatadas = paciente.consultas.map(c => {
      let diagnostico = null;
      try {
        if (c.observacoes) {
          const clinico = JSON.parse(c.observacoes);
          diagnostico = clinico.diagnostico || null;
        }
      } catch {}
      return {
        id: c.id,
        data: c.data_hora,
        medico: c.medicos?.users?.name,
        status: c.status,
        diagnostico,
        prescricoes: c.prescricoes.map(p => ({
          medicamento: p.medicamento,
          dosagem: p.dosagem,
          data: p.data_prescricao,
        })),
      };
    });

    return {
      paciente: {
        id: paciente.id,
        nome: paciente.users?.name,
        email: paciente.users?.email,
        data_nascimento: paciente.data_nascimento,
        sexo: paciente.sexo,
        telefone: paciente.telefone,
        endereco: paciente.endereco,
        historico_medico: paciente.historico_medico,
        ativo: paciente.users?.ativo,
      },
      total_consultas: consultasFormatadas.length,
      consultas: consultasFormatadas,
    };
  }
}
