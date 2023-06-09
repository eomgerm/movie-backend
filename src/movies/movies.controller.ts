import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/createMovieDto';
import { MoviesService } from './movies.service';
import { ReviewsService } from 'src/reviews/reviews.service';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly movieService: MoviesService,
    private readonly reviesService: ReviewsService,
  ) {}
  @Post()
  createMovies(
    @Body(new ParseArrayPipe({ items: CreateMovieDto }))
    movieData: CreateMovieDto[],
  ) {
    if (movieData.length === 0) {
      throw new BadRequestException('No Content Requested');
    }

    return this.movieService.createMovie(movieData);
  }

  @Get('/:id')
  getMovieById(@Param('id') id: string) {
    return this.movieService.findOneById(id);
  }

  @Get()
  getAllMovies() {
    return this.movieService.findAll();
  }

  @Get('/:id/reviews')
  getAllReviws() {}
}
