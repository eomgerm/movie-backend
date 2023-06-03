import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ScreenSchedule } from "./ScreenSchedule";
import { Users } from "./Users";

@Index(
  "FK_bookings_schedule_id_screen_schedule_schedule_id",
  ["scheduleId"],
  {}
)
@Index("IX_bookings_1", ["userId"], {})
@Entity("bookings", { schema: "movie" })
export class Bookings {
  @Column("bigint", {
    primary: true,
    name: "booking_id",
    comment: "예약 아이디",
  })
  bookingId: string;

  @Column("datetime", { name: "booked_at", comment: "예매 시간" })
  bookedAt: Date;

  @Column("bigint", { name: "schedule_id", comment: "예약한 영화" })
  scheduleId: string;

  @Column("bigint", { name: "user_id", comment: "예약한 사용자" })
  userId: string;

  @Column("int", { name: "status", comment: "상태" })
  status: number;

  @Column("varchar", { name: "seats", comment: "예약한 자리", length: 30 })
  seats: string;

  @ManyToOne(
    () => ScreenSchedule,
    (screenSchedule) => screenSchedule.bookings,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "schedule_id", referencedColumnName: "scheduleId" }])
  schedule: ScreenSchedule;

  @ManyToOne(() => Users, (users) => users.bookings, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Users;
}
