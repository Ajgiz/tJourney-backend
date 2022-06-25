import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  @Length(6, 55)
  @IsOptional()
  password?: string;

  @IsEmail({}, { message: 'Email not valid' })
  email: string;
}
