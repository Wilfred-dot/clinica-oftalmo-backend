import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async create(createPacienteDto: CreatePacienteDto) {
    const existing = await this.prisma.users.findUnique({ where: { email: createPacienteDto.email } });
    if (existing) throw new ConflictException('Email já existe');
    const hash = await bcrypt.hash(createPacienteDto.password, 10);
    const user = await this.prisma.users.create({
      data: {
        name: createPacienteDto.name,
        email: createPacienteDto.email,
        password: hash,
        role: 'paciente',
      },
    });
    return this.prisma.pacientes.create({
      data: {
        user_id: user.id,
        data_nascimento: new Date(createPacienteDto.data_nascimento),
        sexo: createPacienteDto.sexo,
        telefone: createPacienteDto.telefone,
        endereco: createPacienteDto.endereco,
        historico_medico: createPacienteDto.historico_medico,
      },
      include: { users: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAll() {
    return this.prisma.pacientes.findMany({
      include: { users: { select: { id: true, name: true, email: true } } },
    });
  }

  async findOne(id: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id },
      include: { users: { select: { id: true, name: true, email: true } } },
    });
    if (!paciente) throw new NotFoundException('Paciente não encontrado');
    return paciente;
  }

  // ─── novo método ──────────────────────────────────
  async findByUserId(userId: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { user_id: userId },
      include: { users: { select: { id: true, name: true, email: true } } },
    });
    if (!paciente) throw new NotFoundException('Paciente não encontrado para este utilizador');
    return paciente;
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.findOne(id);
    if (updatePacienteDto.email && paciente.users) {
      await this.prisma.users.update({
        where: { id: paciente.user_id },
        data: { email: updatePacienteDto.email },
      });
    }
    return this.prisma.pacientes.update({
      where: { id },
      data: {
        data_nascimento: updatePacienteDto.data_nascimento ? new Date(updatePacienteDto.data_nascimento) : undefined,
        sexo: updatePacienteDto.sexo,
        telefone: updatePacienteDto.telefone,
        endereco: updatePacienteDto.endereco,
        historico_medico: updatePacienteDto.historico_medico,
      },
      include: { users: { select: { id: true, name: true, email: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.pacientes.delete({ where: { id } });
    return { message: 'Paciente removido' };
  }
}
