import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScreenSchedule } from './ScreenSchedule';
import { TheaterAddress } from './TheaterAddress';

@Index('FK_theaters_address_theater_address_id', ['address'], {})
@Entity('theaters', { schema: 'movie' })
export class Theaters {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'theater_id',
    comment: '극장 아이디',
  })
  theaterId: number;

  @Column('varchar', { name: 'name', comment: '극장명', length: 10 })
  name: string;

  @Column('int', { name: 'address', comment: '주소' })
  address: number;

  @OneToMany(() => ScreenSchedule, (screenSchedule) => screenSchedule.theater)
  screenSchedules: ScreenSchedule[];

  @ManyToOne(
    () => TheaterAddress,
    (theaterAddress) => theaterAddress.theaters,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'address', referencedColumnName: 'id' }])
  address2: TheaterAddress;
}
