import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'Email for Login',
    required: true,
  })
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: 'Password for Login',
    required: true,
  })
  @IsString()
  readonly password: string;
}
