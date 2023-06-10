import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { Users } from 'src/entities/Users';
import { DataSource, EntityManager } from 'typeorm';
import { Reviews } from 'src/entities/Reviews';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}
  async createUser(userData: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const isUserExists = await this.findbyEmail(userData.email);
      if (isUserExists) {
        throw new ForbiddenException('Email already exists');
      }
      const insertResult = await queryRunner.manager.insert(Users, userData);
      await queryRunner.commitTransaction();

      return insertResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`DB ERROR - ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findbyEmail(email: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    return await queryRunner.manager.findOneBy(Users, { email: email });
  }

  async checkReviewOwner(
    userId: string,
    reviewId: string,
    dbManager: EntityManager,
  ) {
    const isOwner = await dbManager.exists(Reviews, {
      where: { author: userId, reviewId: reviewId },
    });

    return isOwner;
  }

  async deleteReview(reviewId: string, dbManager: EntityManager) {
    await dbManager.delete(Reviews, reviewId);
  }
}
