import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Theaters } from './Theaters';

@Entity('theater_address', { schema: 'movie' })
export class TheaterAddress {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'PK' })
  id: number;

  @Column('varchar', {
    name: 'road',
    nullable: true,
    comment: '도로명 주소',
    length: 100,
  })
  road: string | null;

  @Column('varchar', {
    name: 'lot',
    nullable: true,
    comment: '지번 주소',
    length: 100,
  })
  lot: string | null;

  @OneToMany(() => Theaters, (theaters) => theaters.address2)
  theaters: Theaters[];
}
