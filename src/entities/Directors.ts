import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MovieDirectors } from "./MovieDirectors";

@Entity("directors", { schema: "movie" })
export class Directors {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
    comment: "감독 아이디",
  })
  id: string;

  @Column("varchar", { name: "name", comment: "감독 이름", length: 20 })
  name: string;

  @Column("varchar", {
    name: "profile_image",
    nullable: true,
    comment: "사진",
    length: 300,
  })
  profileImage: string | null;

  @OneToMany(() => MovieDirectors, (movieDirectors) => movieDirectors.director)
  movieDirectors: MovieDirectors[];
}
