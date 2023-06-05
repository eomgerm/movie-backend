import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookings } from './Bookings';

@Index('FK_booking_seats_booking_id_bookings_booking_id', ['bookingId'], {})
@Entity('booking_seats', { schema: 'movie' })
export class BookingSeats {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: 'PK' })
  id: string;

  @Column('bigint', { name: 'booking_id', comment: '예약 아이디' })
  bookingId: string;

  @Column('varchar', { name: 'seat', comment: '자리', length: 3 })
  seat: string;

  @ManyToOne(() => Bookings, (bookings) => bookings.bookingId, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'booking_id', referencedColumnName: 'bookingId' }])
  booking: Bookings;
}
