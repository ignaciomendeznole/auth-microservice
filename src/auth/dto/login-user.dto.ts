import { IsString, IsEmail, Min, Max } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Min(8)
  @Max(20)
  password: string;
}
