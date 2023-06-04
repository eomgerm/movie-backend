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
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @Post()
  createMovies(
    @Body(new ParseArrayPipe({ items: CreateMovieDto }))
    movieData: CreateMovieDto[],
  ) {
    if (movieData.length === 0) {
      throw new BadRequestException('No Content Requested');
    }

    const result = this.movieService.createMovie(movieData);

    return result;
  }

  @Get('/:id')
  findMovie(@Param('id') id: string) {
    return this.movieService.findMovieById(id);
  }
}
