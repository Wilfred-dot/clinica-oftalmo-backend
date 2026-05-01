import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateMedicoDto {
  @IsOptional()
  @IsString()
  especialidade?: string;

  @IsOptional()
  @IsString()
  numero_ordem?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/, { message: 'Formato inválido. Use HH:MM-HH:MM' })
  horario_trabalho?: string;
}
