import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MovieActors } from "./MovieActors";
import { MovieDirectors } from "./MovieDirectors";
import { MovieGenres } from "./MovieGenres";
import { Posters } from "./Posters";
import { Reviews } from "./Reviews";
import { ScreenSchedule } from "./ScreenSchedule";
import { Trailers } from "./Trailers";

@Index("IX_movies_1", ["wkBookingRates", "openDate", "totalRating"], {})
@Entity("movies", { schema: "movie" })
export class Movies {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "movie_id",
    comment: "영화 아이디",
  })
  movieId: string;

  @Column("varchar", { name: "title", comment: "제목", length: 50 })
  title: string;

  @Column("datetime", { name: "open_date", nullable: true, comment: "개봉일" })
  openDate: Date | null;

  @Column("float", {
    name: "wk_booking_rates",
    comment: "주간 예매율",
    precision: 12,
    default: () => "'0'",
  })
  wkBookingRates: number;

  @Column("text", { name: "summary", nullable: true, comment: "요약" })
  summary: string | null;

  @Column("int", {
    name: "watch_grade",
    comment: "관람 등급",
    default: () => "'0'",
  })
  watchGrade: number;

  @Column("float", {
    name: "total_rating",
    comment: "평점",
    precision: 12,
    default: () => "'0'",
  })
  totalRating: number;

  @Column("int", { name: "status", comment: "상영 상태", default: () => "'0'" })
  status: number;

  @Column("datetime", {
    name: "created_at",
    comment: "생성 날짜",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    comment: "수정 날짜",
  })
  updatedAt: Date | null;

  @OneToMany(() => MovieActors, (movieActors) => movieActors.movie)
  movieActors: MovieActors[];

  @OneToMany(() => MovieDirectors, (movieDirectors) => movieDirectors.movie)
  movieDirectors: MovieDirectors[];

  @OneToMany(() => MovieGenres, (movieGenres) => movieGenres.movie)
  movieGenres: MovieGenres[];

  @OneToMany(() => Posters, (posters) => posters.movie)
  posters: Posters[];

  @OneToMany(() => Reviews, (reviews) => reviews.movie)
  reviews: Reviews[];

  @OneToMany(() => ScreenSchedule, (screenSchedule) => screenSchedule.movie)
  screenSchedules: ScreenSchedule[];

  @OneToMany(() => Trailers, (trailers) => trailers.movie)
  trailers: Trailers[];
}
