import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Genres } from "./Genres";
import { Movies } from "./Movies";

@Index("FK_movie_genres_genre_id_genres_genre_id", ["genreId"], {})
@Index("IX_movie_genres_1", ["movieId"], {})
@Entity("movie_genres", { schema: "movie" })
export class MovieGenres {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "PK" })
  id: number;

  @Column("bigint", { name: "movie_id", comment: "영화 아이디" })
  movieId: string;

  @Column("int", { name: "genre_id", comment: "장르 아이디" })
  genreId: number;

  @ManyToOne(() => Genres, (genres) => genres.movieGenres, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "genre_id", referencedColumnName: "genreId" }])
  genre: Genres;

  @ManyToOne(() => Movies, (movies) => movies.movieGenres, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "movie_id", referencedColumnName: "movieId" }])
  movie: Movies;
}
