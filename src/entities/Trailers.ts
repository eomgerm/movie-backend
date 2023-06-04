import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movies } from './Movies';

@Index('FK_trailers_movie_id_movies_movie_id', ['movieId'], {})
@Entity('trailers', { schema: 'movie' })
export class Trailers {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: 'PK' })
  id: string;

  @Column('bigint', { name: 'movie_id', comment: '영화 아이디' })
  movieId: string;

  @Column('varchar', {
    name: 'path',
    comment: '트레일러 비디오 경로',
    length: 300,
  })
  path: string;

  @ManyToOne(() => Movies, (movies) => movies.trailers, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'movie_id', referencedColumnName: 'movieId' }])
  movie: Movies;
}
