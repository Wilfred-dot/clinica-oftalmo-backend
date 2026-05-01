import { IsString, IsOptional, IsEmail, IsDateString, IsIn } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsDateString()
  data_nascimento: string;

  @IsString()
  @IsIn(['M','F','O'])
  sexo: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsString()
  endereco: string;

  @IsOptional()
  @IsString()
  historico_medico?: string;
}
