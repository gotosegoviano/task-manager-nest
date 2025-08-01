import { IsOptional, IsEnum, IsString, IsEmail } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class FilterUsersDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
