import { IsString, IsOptional } from 'class-validator';

export class UpdatePrescricaoDto {
  @IsOptional()
  @IsString()
  medicamento?: string;

  @IsOptional()
  @IsString()
  dosagem?: string;

  @IsOptional()
  @IsString()
  instrucoes?: string;
}
