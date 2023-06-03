import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MovieGenres } from "./MovieGenres";

@Entity("genres", { schema: "movie" })
export class Genres {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "genre_id",
    comment: "장르 아이디",
  })
  genreId: number;

  @Column("varchar", { name: "genre", comment: "장르", length: 10 })
  genre: string;

  @OneToMany(() => MovieGenres, (movieGenres) => movieGenres.genre)
  movieGenres: MovieGenres[];
}
