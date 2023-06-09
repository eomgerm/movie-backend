import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ReviewsService } from 'src/reviews/reviews.service';

@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [MoviesService, ReviewsService],
})
export class MoviesModule {}
