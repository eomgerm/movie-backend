import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movies } from 'src/entities/Movies';

@Module({
  imports: [],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
