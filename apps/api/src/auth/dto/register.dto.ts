import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @Length(3, 32) @Matches(/^[a-zA-Z0-9_]+$/)
  username!: string;
  @IsEmail()
  email!: string;
  @IsString() @MinLength(12) @Length(12, 128)
  password!: string;
}
