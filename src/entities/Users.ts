import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookings } from './Bookings';
import { ReviewHelpful } from './ReviewHelpful';
import { Reviews } from './Reviews';
import { ApiProperty } from '@nestjs/swagger';

@Index('IX_users_1', ['email', 'name', 'username'], {})
@Entity('users', { schema: 'movie' })
export class Users {
  @ApiProperty({
    example: 1,
    description: '사용자 아이디',
  })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
    comment: '사용자 아이디',
  })
  userId: string;

  @Column('datetime', {
    name: 'registered_at',
    comment: '가입 날짜',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  registeredAt: Date;

  @Column('datetime', {
    name: 'disabled_at',
    nullable: true,
    comment: '비활성화 된 시간',
  })
  disabledAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: '수정된 시간',
  })
  updatedAt: Date | null;

  @Column('datetime', {
    name: 'last_access',
    comment: '마지막 접속 시간',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  lastAccess: Date;

  @Column('int', { name: 'status', comment: '계정 상태', default: () => "'0'" })
  status: number;

  @Column('varchar', {
    name: 'email',
    comment: '로그인 시 사용하는 이메일',
    length: 100,
  })
  email: string;

  @Column('text', { name: 'password', comment: '비밀번호' })
  password: string;

  @Column('varchar', { name: 'name', comment: '이름', length: 20 })
  name: string;

  @Column('varchar', { name: 'username', comment: '닉네임', length: 10 })
  username: string;

  @Column('varchar', { name: 'mobile', comment: '전화번호', length: 15 })
  mobile: string;

  @Column('datetime', { name: 'birth_date', comment: '생년월일' })
  birthDate: Date;

  @Column('int', { name: 'gender', comment: '성별' })
  gender: number;

  @Column('varchar', {
    name: 'profile_image',
    nullable: true,
    comment: '프로필 이미지',
    length: 300,
  })
  profileImage: string | null;

  @OneToMany(() => Bookings, (bookings) => bookings.user)
  bookings: Bookings[];

  @OneToMany(() => ReviewHelpful, (reviewHelpful) => reviewHelpful.user)
  reviewHelpfuls: ReviewHelpful[];

  @OneToMany(() => Reviews, (reviews) => reviews.author2)
  reviews: Reviews[];
}
