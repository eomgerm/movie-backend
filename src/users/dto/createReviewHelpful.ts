import { IsNumber } from 'class-validator';

export class CreateReviewHelpfulDto {
  @IsNumber()
  reviewId: string;
}
