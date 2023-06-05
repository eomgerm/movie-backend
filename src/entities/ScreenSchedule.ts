import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookings } from './Bookings';
import { Theaters } from './Theaters';
import { Movies } from './Movies';

@Index('IX_screen_schedule_1', ['start', 'movieId', 'theaterId'], {})
@Index('FK_screen_schedule_theater_id_theaters_theater_id', ['theaterId'], {})
@Index('FK_screen_schedule_movie_id_movies_movie_id', ['movieId'], {})
@Entity('screen_schedule', { schema: 'movie' })
export class ScreenSchedule {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'schedule_id',
    comment: '스케쥴 아이디',
  })
  scheduleId: string;

  @Column('int', { name: 'cinema', comment: '상영 영화관' })
  cinema: number;

  @Column('bigint', { name: 'movie_id', comment: '상영 영화' })
  movieId: string;

  @Column('datetime', { name: 'start', comment: '상영 시작 시간' })
  start: Date;

  @Column('int', { name: 'theater_id', comment: '소속 극장' })
  theaterId: number;

  @OneToMany(() => Bookings, (bookings) => bookings.schedule)
  bookings: Bookings[];

  @ManyToOne(() => Theaters, (theaters) => theaters.screenSchedules, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'theater_id', referencedColumnName: 'theaterId' }])
  theater: Theaters;

  @ManyToOne(() => Movies, (movies) => movies.screenSchedules, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'movie_id', referencedColumnName: 'movieId' }])
  movie: Movies;
}
