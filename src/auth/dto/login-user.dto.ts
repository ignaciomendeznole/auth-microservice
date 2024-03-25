import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
