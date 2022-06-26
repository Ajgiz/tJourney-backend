import { IsString, Length, IsEmail } from 'class-validator';

export class AuthRegisterDto {
  @IsString()
  @Length(6, 55)
  password: string;

  @IsEmail({}, { message: 'Email not valid' })
  email: string;

  @IsString()
  fullName: string;
}
