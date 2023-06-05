import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('booking_seats', { schema: 'movie' })
export class BookingSeats {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: 'PK' })
  id: string;

  @Column('varchar', { name: 'seat', comment: '좌석', length: 3 })
  seat: string;
}
