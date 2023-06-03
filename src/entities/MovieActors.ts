import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Actors } from "./Actors";
import { Movies } from "./Movies";

@Index("FK_movie_actors_movie_id_movies_movie_id", ["movieId"], {})
@Index("IX_movie_actors_1", ["actorId", "movieId"], {})
@Entity("movie_actors", { schema: "movie" })
export class MovieActors {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "PK" })
  id: number;

  @Column("bigint", { name: "movie_id", comment: "출현한 영화" })
  movieId: string;

  @Column("bigint", { name: "actor_id", comment: "배우" })
  actorId: string;

  @Column("varchar", { name: "role", comment: "역할", length: 10 })
  role: string;

  @ManyToOne(() => Actors, (actors) => actors.movieActors, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "actor_id", referencedColumnName: "actorId" }])
  actor: Actors;

  @ManyToOne(() => Movies, (movies) => movies.movieActors, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "movie_id", referencedColumnName: "movieId" }])
  movie: Movies;
}
