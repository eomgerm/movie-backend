import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly mobile: string;

  @IsDateString()
  readonly birthDate: Date;

  @IsNumber()
  readonly gender: number;

  @IsString()
  readonly profileUrl: string;
}
