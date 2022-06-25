import { IsString, Length, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @Length(6, 55)
  password: string;

  @IsEmail({}, { message: 'Email not valid' })
  email: string;
}
