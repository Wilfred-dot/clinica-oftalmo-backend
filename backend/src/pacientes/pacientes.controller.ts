import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('pacientes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @Roles('admin', 'recepcionista')
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto);
  }

  @Get()
  @Roles('admin', 'recepcionista', 'medico')
  findAll(@Query('search') search?: string) {
    return this.pacientesService.findAll(search);
  }

  @Get('me')
  @Roles('admin', 'recepcionista', 'medico', 'paciente')
  findMe(@Request() req) {
    return this.pacientesService.findByUserId(req.user.userId);
  }

  @Get(':id')
  @Roles('admin', 'recepcionista', 'medico', 'paciente')
  async findOne(@Param('id') id: string, @Request() req) {
    const paciente = await this.pacientesService.findOne(+id);
    if (req.user.role === 'paciente' && paciente.user_id !== req.user.userId) {
      throw new ForbiddenException('Acesso negado');
    }
    return paciente;
  }

  @Patch(':id')
  @Roles('admin', 'recepcionista')
  update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) {
    return this.pacientesService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(+id);
  }
}
