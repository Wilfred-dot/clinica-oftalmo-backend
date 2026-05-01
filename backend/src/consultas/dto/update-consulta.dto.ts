import { IsOptional, IsString, IsIn, ValidateIf } from 'class-validator';

export class UpdateConsultaDto {
  @IsOptional()
  @IsString()
  @IsIn(['confirmada', 'realizada', 'cancelada'])
  status?: string;

  // Campos clínicos – obrigatórios se status = 'realizada'
  @ValidateIf(o => o.status === 'realizada')
  @IsString()
  motivo?: string;

  @ValidateIf(o => o.status === 'realizada')
  @IsString()
  acuidade_visual?: string;

  @ValidateIf(o => o.status === 'realizada')
  @IsString()
  pressao_intraocular?: string;

  @ValidateIf(o => o.status === 'realizada')
  @IsString()
  diagnostico?: string;

  @ValidateIf(o => o.status === 'realizada')
  @IsString()
  plano_tratamento?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
