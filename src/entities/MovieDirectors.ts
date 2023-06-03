import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Directors } from "./Directors";
import { Movies } from "./Movies";

@Index("FK_movie_directors_director_id_directors_id", ["directorId"], {})
@Index("FK_movie_directors_movie_id_movies_movie_id", ["movieId"], {})
@Entity("movie_directors", { schema: "movie" })
export class MovieDirectors {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "PK" })
  id: string;

  @Column("bigint", { name: "director_id", comment: "감독 아이디" })
  directorId: string;

  @Column("bigint", { name: "movie_id", comment: "감독한 영화" })
  movieId: string;

  @ManyToOne(() => Directors, (directors) => directors.movieDirectors, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "director_id", referencedColumnName: "id" }])
  director: Directors;

  @ManyToOne(() => Movies, (movies) => movies.movieDirectors, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "movie_id", referencedColumnName: "movieId" }])
  movie: Movies;
}
