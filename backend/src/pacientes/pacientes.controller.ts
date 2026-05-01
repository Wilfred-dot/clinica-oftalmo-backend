import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
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
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  @Roles('admin', 'recepcionista', 'medico')
  findAll() {
    return this.pacientesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'recepcionista', 'medico', 'paciente')
  async findOne(@Param('id') id: string, @Request() req) {
    const paciente = await this.pacientesService.findOne(+id);
    // Se for paciente, só pode ver o seu próprio perfil
    if (req.user.role === 'paciente' && paciente.user_id !== req.user.userId) {
      throw new ForbiddenException('Acesso negado');
    }
    return paciente;
  }

  @Patch(':id')
  @Roles('admin', 'recepcionista')
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(+id, updatePacienteDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(+id);
  }
}
