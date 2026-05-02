import { IsEmail, IsString, MinLength, IsIn, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsIn(['admin', 'medico', 'recepcionista', 'paciente'])
  role: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
