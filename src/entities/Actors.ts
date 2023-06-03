import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MovieActors } from "./MovieActors";

@Entity("actors", { schema: "movie" })
export class Actors {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "actor_id",
    comment: "배우 아이디",
  })
  actorId: string;

  @Column("varchar", { name: "name", comment: "배우 이름", length: 20 })
  name: string;

  @Column("varchar", {
    name: "profile_image",
    nullable: true,
    comment: "사진",
    length: 300,
  })
  profileImage: string | null;

  @OneToMany(() => MovieActors, (movieActors) => movieActors.actor)
  movieActors: MovieActors[];
}
