import { IsEmail, IsString, Length, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(4, 20, { message: 'Name must be between 4 and 20 characters' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Length(8, 20, { message: 'Name must be between 8 and 20 characters' })
  password: string;
}
