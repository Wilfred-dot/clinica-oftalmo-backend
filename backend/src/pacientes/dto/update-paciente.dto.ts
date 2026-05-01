import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

export class UpdatePacienteDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsDateString()
  data_nascimento?: string;

  @IsOptional()
  @IsString()
  @IsIn(['M','F','O'])
  sexo?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  historico_medico?: string;
}
