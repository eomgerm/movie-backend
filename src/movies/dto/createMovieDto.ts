import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ActorDto {
  @ApiProperty({
    example: '홍길동',
    description: 'actor name',
  })
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly role: string;
}

export class DirectorDto {
  @IsString()
  readonly name: string;
}

export class CreateMovieDto {
  @ApiProperty({
    description: 'bla',
  })
  @IsString()
  readonly title: string;

  @IsDateString()
  readonly openDate: Date;

  @IsString()
  readonly summary: string;

  @IsNumber()
  readonly watchGrade: number;

  @IsString({ each: true })
  readonly genres: string[];

  @IsInt()
  readonly runningTime: number;

  @ApiProperty({
    type: ActorDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActorDto)
  readonly actors: ActorDto[];

  @ApiProperty({
    type: DirectorDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DirectorDto)
  readonly directors: DirectorDto[];

  @IsString({ each: true })
  readonly posters: string[];

  @IsString({ each: true })
  readonly trailers: string[];
}
