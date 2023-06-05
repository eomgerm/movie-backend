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

    return this.movieService.createMovie(movieData);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOneById(id);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }
}
