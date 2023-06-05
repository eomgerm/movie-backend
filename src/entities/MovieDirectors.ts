import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movies } from './Movies';
import { Directors } from './Directors';

@Index('FK_movie_directors_movie_id_movies_movie_id', ['movieId'], {})
@Index('FK_movie_directors_director_id_directors_id', ['directorId'], {})
@Entity('movie_directors', { schema: 'movie' })
export class MovieDirectors {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: 'PK' })
  id: string;

  @Column('bigint', { name: 'director_id', comment: '감독 아이디' })
  directorId: string;

  @Column('bigint', { name: 'movie_id', comment: '감독한 영화' })
  movieId: string;

  @ManyToOne(() => Movies, (movies) => movies.movieDirectors, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'movie_id', referencedColumnName: 'movieId' }])
  movie: Movies;

  @ManyToOne(() => Directors, (directors) => directors.movieDirectors, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'director_id', referencedColumnName: 'directorId' }])
  director: Directors;
}
