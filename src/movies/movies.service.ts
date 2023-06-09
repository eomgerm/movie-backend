import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/createMovieDto';
import { Movies } from 'src/entities/Movies';
import { DataSource } from 'typeorm';
import { Actors } from 'src/entities/Actors';
import { Directors } from 'src/entities/Directors';
import { MovieActors } from 'src/entities/MovieActors';
import { MovieDirectors } from 'src/entities/MovieDirectors';
import { Posters } from 'src/entities/Posters';
import { Trailers } from 'src/entities/Trailers';
import { Genres } from 'src/entities/Genres';
import { MovieGenres } from 'src/entities/MovieGenres';

@Injectable()
export class MoviesService {
  constructor(private dataSource: DataSource) {}
  async createMovie(movieData: CreateMovieDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (const movie of movieData) {
        const { actors, directors, posters, trailers, genres } = movie;

        const insertMovieValue = {
          title: movie.title,
          openDate: movie.openDate,
          summary: movie.summary,
          watchGrade: movie.watchGrade,
          runningTime: movie.runningTime,
        };

        const { movieId } = await queryRunner.manager.save(
          Movies,
          insertMovieValue,
        );

        for (const actor of actors) {
          const result = await queryRunner.manager.findOneBy(Actors, {
            name: actor.name,
          });

          let actorId = result?.actorId;
          if (!actorId) {
            const { generatedMaps } = await queryRunner.manager.insert(Actors, {
              name: actor.name,
            });
            actorId = generatedMaps[0].actorId;
          }

          await queryRunner.manager.insert(MovieActors, {
            movieId,
            actorId,
            role: actor.role,
          });
        }

        for (const director of directors) {
          const result = await queryRunner.manager.findOneBy(Directors, {
            name: director.name,
          });

          let directorId = result?.directorId;
          if (!directorId) {
            const { generatedMaps } = await queryRunner.manager.insert(
              Directors,
              {
                name: director.name,
              },
            );
            directorId = generatedMaps[0].directorId;
          }

          await queryRunner.manager.save(MovieDirectors, {
            movieId,
            directorId,
          });
        }

        for (const poster of posters) {
          await queryRunner.manager.save(Posters, { movieId, path: poster });
        }

        for (const trailer of trailers) {
          await queryRunner.manager.save(Trailers, { movieId, path: trailer });
        }

        for (const genre of genres) {
          const { genreId } = await queryRunner.manager.findOneBy(Genres, {
            genre: genre,
          });

          await queryRunner.manager.insert(MovieGenres, { movieId, genreId });
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`DB ERROR - ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findOneById(movieId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      queryRunner.connect();
      queryRunner.startTransaction();

      const movieData = await queryRunner.manager.findOne(Movies, {
        where: { movieId: movieId },
      });

      if (!movieData) {
        return new NotFoundException(`Movie ${movieId} not found`);
      }

      const {
        movieId: id,
        title,
        openDate,
        watchGrade,
        wkBookingRates,
        summary,
        totalRating,
        runningTime,
        status,
      } = movieData;

      const directorsRaw = await queryRunner.manager.find(MovieDirectors, {
        relations: { director: true },
        where: { movieId },
      });
      const directors = directorsRaw.map(({ director }) => ({
        name: director.name,
        profileImage: director.profileImage,
      }));

      const actorsRaw = await queryRunner.manager.find(MovieActors, {
        relations: { actor: true },
        where: { movieId },
      });
      const actors = actorsRaw.map((actorRaw) => ({
        role: actorRaw.role,
        name: actorRaw.actor.name,
        profileImage: actorRaw.actor.profileImage,
      }));

      const postersRaw = await queryRunner.manager.find(Posters, {
        where: { movieId },
      });
      const posters = postersRaw.map(({ path }) => path);

      const trailersRaw = await queryRunner.manager.find(Trailers, {
        where: { movieId },
      });
      const trailers = trailersRaw.map(({ path }) => path);

      const genresRaw = await queryRunner.manager.find(MovieGenres, {
        where: { movieId },
        relations: { genre: true },
      });
      const genres = genresRaw.map(({ genre }) => genre.genre);

      return {
        id,
        title,
        openDate,
        watchGrade,
        wkBookingRates,
        summary,
        totalRating,
        runningTime,
        status,
        genres,
        actors,
        posters,
        trailers,
      };
    } catch (error) {
      throw new InternalServerErrorException(`DB ERROR, ${error.message}`);
    } finally {
      queryRunner.release();
    }
  }

  async findAll() {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      queryRunner.connect();
      queryRunner.startTransaction();

      const moviesData = await queryRunner.manager.find(Movies);

      if (!moviesData) {
        return new NotFoundException(`Movies not found`);
      }

      let movies = [];
      for (const movieData of moviesData) {
        const {
          movieId: id,
          title,
          openDate,
          watchGrade,
          wkBookingRates,
          summary,
          totalRating,
          runningTime,
          status,
        } = movieData;

        const directorsRaw = await queryRunner.manager.find(MovieDirectors, {
          relations: { director: true },
          where: { movieId: id },
        });
        const directors = directorsRaw.map(({ director }) => ({
          name: director.name,
          profileImage: director.profileImage,
        }));

        const actorsRaw = await queryRunner.manager.find(MovieActors, {
          relations: { actor: true },
          where: { movieId: id },
        });
        const actors = actorsRaw.map((actorRaw) => ({
          role: actorRaw.role,
          name: actorRaw.actor.name,
          profileImage: actorRaw.actor.profileImage,
        }));

        const postersRaw = await queryRunner.manager.find(Posters, {
          where: { movieId: id },
        });
        const posters = postersRaw.map(({ path }) => path);

        const trailersRaw = await queryRunner.manager.find(Trailers, {
          where: { movieId: id },
        });
        const trailers = trailersRaw.map(({ path }) => path);

        const genresRaw = await queryRunner.manager.find(MovieGenres, {
          where: { movieId: id },
          relations: { genre: true },
        });
        const genres = genresRaw.map(({ genre }) => genre.genre);

        movies.push({
          id,
          title,
          openDate,
          watchGrade,
          wkBookingRates,
          summary,
          totalRating,
          runningTime,
          status,
          genres,
          actors,
          posters,
          trailers,
        });
      }

      return movies;
    } catch (error) {
      throw new InternalServerErrorException(`DB ERROR, ${error.message}`);
    } finally {
      queryRunner.release();
    }
  }
}
