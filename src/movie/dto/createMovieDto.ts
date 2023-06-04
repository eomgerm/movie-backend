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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActorDto)
  readonly actors: ActorDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DirectorDto)
  readonly directors: DirectorDto[];

  @IsString({ each: true })
  readonly posters: string[];

  @IsString({ each: true })
  readonly trailers: string[];
}
