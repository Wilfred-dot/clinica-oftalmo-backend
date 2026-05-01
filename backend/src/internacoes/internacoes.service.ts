import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternacaoDto } from './dto/create-internacao.dto';
import { UpdateInternacaoDto } from './dto/update-internacao.dto';

@Injectable()
export class InternacoesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInternacaoDto) {
    const paciente = await this.prisma.pacientes.findUnique({ where: { id: dto.paciente_id } });
    if (!paciente) throw new NotFoundException('Paciente não encontrado');

    if (dto.data_reintegracao && new Date(dto.data_reintegracao) < new Date(dto.data_entrada)) {
      throw new BadRequestException('Data de reintegração não pode ser anterior à data de entrada');
    }

    // Gera um número de processo sequencial simples (AAAAMMDD-XXX)
    const hoje = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const count = await this.prisma.processo_internacao.count({
      where: { nr_processo: { startsWith: hoje } },
    });
    const nrProcesso = `${hoje}-${(count + 1).toString().padStart(3, '0')}`;

    return this.prisma.processo_internacao.create({
      data: {
        nr_processo: nrProcesso,
        paciente_id: dto.paciente_id,
        data_entrada: new Date(dto.data_entrada),
        data_reintegracao: dto.data_reintegracao ? new Date(dto.data_reintegracao) : null,
        causa: dto.causa,
      },
      include: { pacientes: { include: { users: { select: { id: true, name: true, email: true } } } } },
    });
  }

  async findAll() {
    return this.prisma.processo_internacao.findMany({
      include: { pacientes: { include: { users: { select: { id: true, name: true, email: true } } } } },
      orderBy: { data_entrada: 'desc' },
    });
  }

  async findOne(nrProcesso: string) {
    const proc = await this.prisma.processo_internacao.findUnique({
      where: { nr_processo: nrProcesso },
      include: { pacientes: { include: { users: { select: { id: true, name: true, email: true } } } } },
    });
    if (!proc) throw new NotFoundException('Processo de internação não encontrado');
    return proc;
  }

  async update(nrProcesso: string, dto: UpdateInternacaoDto) {
    await this.findOne(nrProcesso);

    if (dto.data_reintegracao && new Date(dto.data_reintegracao) < new Date(dto.data_entrada || (await this.findOne(nrProcesso)).data_entrada)) {
      throw new BadRequestException('Data de reintegração não pode ser anterior à data de entrada');
    }

    return this.prisma.processo_internacao.update({
      where: { nr_processo: nrProcesso },
      data: {
        data_entrada: dto.data_entrada ? new Date(dto.data_entrada) : undefined,
        data_reintegracao: dto.data_reintegracao ? new Date(dto.data_reintegracao) : undefined,
        causa: dto.causa,
      },
      include: { pacientes: { include: { users: { select: { id: true, name: true, email: true } } } } },
    });
  }

  async remove(nrProcesso: string) {
    await this.findOne(nrProcesso);
    await this.prisma.processo_internacao.delete({ where: { nr_processo: nrProcesso } });
    return { message: 'Processo de internação removido' };
  }
}
