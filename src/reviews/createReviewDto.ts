import { IsInt, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  content: string;

  @IsInt()
  rating: number;
}
