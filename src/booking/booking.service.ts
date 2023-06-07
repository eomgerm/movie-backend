import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookingSeats } from 'src/entities/BookingSeats';
import { Bookings } from 'src/entities/Bookings';
import { DataSource, In } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(private dataSource: DataSource) {}

  async createBooking(scheduleId: string, userId: string, seats: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { identifiers } = await queryRunner.manager.insert(Bookings, {
        scheduleId,
        userId,
      });

      const { bookingId } = identifiers[0];

      for (const seat of seats) {
        await queryRunner.manager.insert(BookingSeats, { bookingId, seat });
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

      await queryRunner.manager.delete(Bookings, { bookingId });
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
      await queryRunner.startTransaction();

      const queryResult = await queryRunner.manager.findOneBy(Bookings, {
        bookingId,
      });

      await queryRunner.commitTransaction();
      return queryResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`DB ERROR: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async validateSeats(scheduleId: string, seats: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const isOccupied = await queryRunner.manager.exists(BookingSeats, {
        relations: { booking: true },
        where: { booking: { scheduleId }, seat: In(seats) },
      });
      console.log(isOccupied);

      await queryRunner.commitTransaction();
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
      await queryRunner.startTransaction();

      const isOwner = (await this.findOneById(bookingId)).userId === userId;

      await queryRunner.commitTransaction();
      return isOwner;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`DB ERROR: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
