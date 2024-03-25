import { IsEmail, IsString, Max, Min } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Min(8)
  @Max(20)
  password: string;

  @IsString()
  @Max(20)
  firstName: string;

  @IsString()
  @Max(20)
  lastName: string;
}
