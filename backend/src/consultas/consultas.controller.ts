import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Controller('consultas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  @Roles('admin', 'recepcionista', 'paciente')
  create(@Body() dto: CreateConsultaDto, @Request() req) {
    return this.consultasService.create(dto, req.user.userId, req.user.role);
  }

  @Get()
  @Roles('admin', 'recepcionista', 'medico')
  findAll(@Query() filtros: any) {
    return this.consultasService.findAll(filtros);
  }

  @Get(':id')
  @Roles('admin', 'recepcionista', 'medico', 'paciente')
  async findOne(@Param('id') id: string, @Request() req) {
    const consulta = await this.consultasService.findOne(+id);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (req.user.role === 'paciente' && consulta.pacientes.user_id !== req.user.userId) {
      throw new ForbiddenException('Apenas pode visualizar as suas próprias consultas');
    }
    return consulta;
  }

  @Patch(':id')
  @Roles('admin', 'recepcionista', 'medico', 'paciente')
  update(@Param('id') id: string, @Body() dto: UpdateConsultaDto, @Request() req) {
    return this.consultasService.update(+id, dto, req.user.userId, req.user.role);
  }
}
