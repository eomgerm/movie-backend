import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { query } from 'express';
import { BookingSeats } from 'src/entities/BookingSeats';
import { Bookings } from 'src/entities/Bookings';
import { DataSource, In } from 'typeorm';

@Injectable()
export class BookingsService {
  constructor(private dataSource: DataSource) {}

  async createBooking(scheduleId: string, userId: string, seats: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // const { identifiers } = await queryRunner.manager.insert(Bookings, {
      //   scheduleId,
      //   userId,
      // });
      const insertBookingSql = `insert into bookings(schedule_id, user_id) values(${scheduleId}, ${userId})`;
      const { insertId: bookingId } = await queryRunner.manager.query(
        insertBookingSql,
      );

      const insertSeatSql = `insert into booking_seats(booking_id, seat) values(${bookingId}, ?)`;
      for (const seat of seats) {
        // await queryRunner.manager.insert(BookingSeats, { bookingId, seat });
        await queryRunner.manager.query(insertSeatSql, [seat]);
      }

      await queryRunner.commitTransaction();
      return bookingId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`DB ERROR: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteBooking(bookingId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // await queryRunner.manager.delete(Bookings, { bookingId });
      const deleteBookingSql = `delete from bookings where booking_id = ${bookingId}`;
      await queryRunner.manager.query(deleteBookingSql);
      await queryRunner.commitTransaction();
    } catch (error) {
    } finally {
      await queryRunner.release();
    }
  }

  async findOneById(bookingId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();

      // const queryResult = await queryRunner.manager.findOneBy(Bookings, {
      //   bookingId,
      // });
      const selectBookingSql = `select * from bookings where booking_id = ${bookingId}`;
      const [queryResult] = await queryRunner.manager.query(selectBookingSql);

      return queryResult;
    } catch (error) {
      throw new InternalServerErrorException(`DB ERROR: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async validateSeats(scheduleId: string, seats: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();

      // const isOccupied = await queryRunner.manager.exists(BookingSeats, {
      //   relations: { booking: true },
      //   where: { booking: { scheduleId }, seat: In(seats) },
      // });
      const validateSeatsSql = `select * from booking_seats s 
      join bookings b on s.booking_id = b.booking_id
      where b.schedule_id = ${scheduleId} and seat in (${seats
        .map((value) => `"${value}"`)
        .join(', ')})`;
      const [queryResult] = await queryRunner.manager.query(validateSeatsSql);

      const isOccupied = queryResult ? true : false;

      return isOccupied;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`DB ERROR: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async validateOwner(bookingId: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();

      const isOwner = (await this.findOneById(bookingId)).userId === userId;

      return isOwner;
    } catch (error) {
      throw new InternalServerErrorException(`DB ERROR: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
