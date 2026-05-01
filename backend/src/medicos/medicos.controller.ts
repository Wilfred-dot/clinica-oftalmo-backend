import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Controller('medicos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateMedicoDto) {
    return this.medicosService.create(dto);
  }

  @Get()
  @Roles('admin', 'recepcionista', 'medico')
  findAll() {
    return this.medicosService.findAll();
  }

  // ─── nova rota ──────────────────────────────────
  @Get('me')
  @Roles('admin', 'recepcionista', 'medico', 'paciente')
  findMe(@Request() req) {
    return this.medicosService.findByUserId(req.user.userId);
  }

  @Get(':id')
  @Roles('admin', 'recepcionista', 'medico')
  findOne(@Param('id') id: string) {
    return this.medicosService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateMedicoDto) {
    return this.medicosService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.medicosService.remove(+id);
  }
}
