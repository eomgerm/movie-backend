import { IsNumber } from 'class-validator';

export class CreateHelpfulReviewDto {
  @IsNumber()
  reviewId: string;
}
