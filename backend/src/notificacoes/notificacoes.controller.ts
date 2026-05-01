import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from './dto/update-notificacao.dto';

@Controller('notificacoes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Post()
  @Roles('admin', 'recepcionista')
  create(@Body() dto: CreateNotificacaoDto) {
    return this.notificacoesService.create(dto);
  }

  @Post('lembrete/:consultaId')
  @Roles('admin', 'recepcionista')
  enviarLembrete(@Param('consultaId') consultaId: string) {
    return this.notificacoesService.enviarLembreteConsulta(+consultaId);
  }

  @Get('minhas')
  @Roles('admin', 'recepcionista', 'medico', 'paciente')
  async minhas(@Request() req) {
    if (req.user.role === 'paciente') {
      const paciente = await this.notificacoesService.prisma.pacientes.findUnique({
        where: { user_id: req.user.userId },
      });
      if (!paciente) throw new ForbiddenException('Paciente não encontrado');
      return this.notificacoesService.findAll({ paciente_id: paciente.id });
    }
    return this.notificacoesService.findAll();
  }

  @Get()
  @Roles('admin', 'recepcionista', 'medico')
  findAll(@Query() filtros: any) {
    return this.notificacoesService.findAll(filtros);
  }

  @Get(':id')
  @Roles('admin', 'recepcionista', 'medico', 'paciente')
  async findOne(@Param('id') id: string, @Request() req) {
    const notif = await this.notificacoesService.findOne(+id);
    if (req.user.role === 'paciente' && notif.pacientes.user_id !== req.user.userId) {
      throw new ForbiddenException('Apenas pode visualizar as suas próprias notificações');
    }
    return notif;
  }

  @Patch(':id')
  @Roles('admin', 'recepcionista')
  update(@Param('id') id: string, @Body() dto: UpdateNotificacaoDto) {
    return this.notificacoesService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.notificacoesService.remove(+id);
  }
}
