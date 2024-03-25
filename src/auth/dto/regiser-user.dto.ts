import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  @MaxLength(20)
  lastName: string;
}
