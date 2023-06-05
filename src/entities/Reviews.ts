import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReviewHelpful } from './ReviewHelpful';
import { Movies } from './Movies';
import { Users } from './Users';

@Index('IX_reviews_1', ['createdAt', 'author', 'movieId'], {})
@Index('FK_reviews_movie_id_movies_movie_id', ['movieId'], {})
@Index('FK_reviews_author_users_user_id', ['author'], {})
@Entity('reviews', { schema: 'movie' })
export class Reviews {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'review_id',
    comment: '감상평 아이디',
  })
  reviewId: string;

  @Column('bigint', { name: 'author', comment: '작성자' })
  author: string;

  @Column('datetime', {
    name: 'created_at',
    comment: '게시일',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at', nullable: true, comment: '수정일' })
  updatedAt: Date | null;

  @Column('bigint', { name: 'movie_id', comment: '감상평 작성한 영화' })
  movieId: string;

  @Column('int', { name: 'rating', comment: '평점' })
  rating: number;

  @Column('varchar', { name: 'content', comment: '내용', length: 300 })
  content: string;

  @Column('int', {
    name: 'helpful_count',
    comment: '도움됐어요 개수',
    default: () => "'0'",
  })
  helpfulCount: number;

  @OneToMany(() => ReviewHelpful, (reviewHelpful) => reviewHelpful.review)
  reviewHelpfuls: ReviewHelpful[];

  @ManyToOne(() => Movies, (movies) => movies.reviews, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'movie_id', referencedColumnName: 'movieId' }])
  movie: Movies;

  @ManyToOne(() => Users, (users) => users.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'author', referencedColumnName: 'userId' }])
  author2: Users;
}
