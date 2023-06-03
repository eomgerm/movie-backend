import { IsString } from 'class-validator';

export class signInDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
