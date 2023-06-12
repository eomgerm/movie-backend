import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/createMovieDto';
import { MoviesService } from './movies.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateReviewDto } from 'src/reviews/createReviewDto';
import { ApiTags } from '@nestjs/swagger';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly movieService: MoviesService,
    private readonly reviewsService: ReviewsService,
  ) {}
  @ApiTags('movies')
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

  @ApiTags('movies')
  @Get('/:movieId')
  getMovieById(@Param('movieId') movieId: string) {
    return this.movieService.findOneById(movieId);
  }

  @ApiTags('movies')
  @Get()
  getAllMovies() {
    return this.movieService.findAll();
  }

  @ApiTags('reviews')
  @Get('/:movieId/reviews')
  async getAllReviws(@Param('movieId') movieId: string) {
    return await this.reviewsService.findAllReviews(movieId);
  }

  @ApiTags('reviews')
  @UseGuards(AuthGuard)
  @Post('/:movieId/reviews')
  async createReview(
    @Param('movieId') movieId: string,
    @Req() req,
    @Body() reviewData: CreateReviewDto,
  ) {
    const {
      user: { sub: userId },
    } = req;

    const checkBookings = await this.reviewsService.checkBookings(
      movieId,
      userId,
    );

    if (!checkBookings) {
      throw new ForbiddenException(
        'Only users booked this movie can write reviews',
      );
    }

    return await this.reviewsService.createReview(reviewData, movieId, userId);
  }
}
