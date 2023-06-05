import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { ScreenSchedule } from './ScreenSchedule';

@Index('IX_bookings_1', ['userId'], {})
@Index(
  'FK_bookings_schedule_id_screen_schedule_schedule_id',
  ['scheduleId'],
  {},
)
@Entity('bookings', { schema: 'movie' })
export class Bookings {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'booking_id',
    comment: '예약 아이디',
  })
  bookingId: string;

  @Column('datetime', {
    name: 'booked_at',
    comment: '예매 시간',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  bookedAt: Date;

  @Column('bigint', { name: 'schedule_id', comment: '예약한 영화' })
  scheduleId: string;

  @Column('bigint', { name: 'user_id', comment: '예약한 사용자' })
  userId: string;

  @Column('int', { name: 'status', comment: '상태' })
  status: number;

  @Column('varchar', { name: 'seats', comment: '예약한 자리', length: 30 })
  seats: string;

  @ManyToOne(() => Users, (users) => users.bookings, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: Users;

  @ManyToOne(
    () => ScreenSchedule,
    (screenSchedule) => screenSchedule.bookings,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'schedule_id', referencedColumnName: 'scheduleId' }])
  schedule: ScreenSchedule;
}
