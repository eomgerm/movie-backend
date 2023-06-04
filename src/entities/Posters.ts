import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movies } from './Movies';

@Index('FK_posters_movie_id_movies_movie_id', ['movieId'], {})
@Entity('posters', { schema: 'movie' })
export class Posters {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: 'PK' })
  id: string;

  @Column('bigint', { name: 'movie_id', comment: '영화 아이디' })
  movieId: string;

  @Column('varchar', {
    name: 'path',
    comment: '포스터 이미지 경로',
    length: 300,
  })
  path: string;

  @ManyToOne(() => Movies, (movies) => movies.posters, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'movie_id', referencedColumnName: 'movieId' }])
  movie: Movies;
}
