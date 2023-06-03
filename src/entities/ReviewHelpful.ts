import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reviews } from "./Reviews";
import { Users } from "./Users";

@Index("FK_review_helpful_review_id_reviews_review_id", ["reviewId"], {})
@Index("FK_review_helpful_user_id_users_user_id", ["userId"], {})
@Index("IX_review_helpful_1", ["helpfulAt", "reviewId"], {})
@Entity("review_helpful", { schema: "movie" })
export class ReviewHelpful {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "PK" })
  id: string;

  @Column("bigint", { name: "user_id", comment: "추천한 사용자" })
  userId: string;

  @Column("bigint", { name: "review_id", comment: "추천한 감상평" })
  reviewId: string;

  @Column("datetime", {
    name: "helpful_at",
    comment: "추천한 날짜",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  helpfulAt: Date;

  @ManyToOne(() => Reviews, (reviews) => reviews.reviewHelpfuls, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "review_id", referencedColumnName: "reviewId" }])
  review: Reviews;

  @ManyToOne(() => Users, (users) => users.reviewHelpfuls, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Users;
}
