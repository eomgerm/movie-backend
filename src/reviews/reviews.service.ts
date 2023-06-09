import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Bookings } from 'src/entities/Bookings';
import { Reviews } from 'src/entities/Reviews';
import { ScreenSchedule } from 'src/entities/ScreenSchedule';
import { DataSource, In } from 'typeorm';
import { CreateReviewDto } from './createReviewDto';

@Injectable()
export class ReviewsService {
  constructor(private dataSource: DataSource) {}

  async findAllReviews(movieId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const queryResult = await queryRunner.manager.find(Reviews, {
        where: { movieId: movieId },
      });

      await queryRunner.commitTransaction();

      return queryResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('DB ERROR: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async checkBookings(movieId: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const scheduleIdRaw = await queryRunner.manager.find(ScreenSchedule, {
        select: { scheduleId: true },
        where: { movieId: movieId },
      });
      const scheduleId = scheduleIdRaw.map(({ scheduleId }) => scheduleId);
      const check = await queryRunner.manager.exists(Bookings, {
        where: { scheduleId: In(scheduleId), userId },
      });

      await queryRunner.commitTransaction();
      return check;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('DB ERROR: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async createReview(
    movieData: CreateReviewDto,
    movieId: string,
    userId: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { identifiers } = await queryRunner.manager.insert(Reviews, {
        author: userId,
        movieId,
        ...movieData,
      });

      await queryRunner.commitTransaction();
      return identifiers[0].reviewId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('DB ERROR: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
