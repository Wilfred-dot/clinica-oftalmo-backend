import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsIn(['admin', 'medico', 'recepcionista', 'paciente'])
  role?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
