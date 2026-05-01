import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { InternacoesService } from './internacoes.service';
import { CreateInternacaoDto } from './dto/create-internacao.dto';
import { UpdateInternacaoDto } from './dto/update-internacao.dto';

@Controller('internacoes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InternacoesController {
  constructor(private readonly internacoesService: InternacoesService) {}

  @Post()
  @Roles('admin', 'medico')
  create(@Body() dto: CreateInternacaoDto) {
    return this.internacoesService.create(dto);
  }

  @Get()
  @Roles('admin', 'medico', 'recepcionista')
  findAll() {
    return this.internacoesService.findAll();
  }

  @Get(':nrProcesso')
  @Roles('admin', 'medico', 'recepcionista')
  findOne(@Param('nrProcesso') nrProcesso: string) {
    return this.internacoesService.findOne(nrProcesso);
  }

  @Patch(':nrProcesso')
  @Roles('admin', 'medico')
  update(@Param('nrProcesso') nrProcesso: string, @Body() dto: UpdateInternacaoDto) {
    return this.internacoesService.update(nrProcesso, dto);
  }

  @Delete(':nrProcesso')
  @Roles('admin')
  remove(@Param('nrProcesso') nrProcesso: string) {
    return this.internacoesService.remove(nrProcesso);
  }
}
