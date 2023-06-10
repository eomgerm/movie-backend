import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { Users } from 'src/entities/Users';
import { DataSource, RelationId } from 'typeorm';
import { Reviews } from 'src/entities/Reviews';
import { ReviewHelpful } from 'src/entities/ReviewHelpful';

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

  async createHelpfulReview(userId: string, reviewId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { identifiers } = await queryRunner.manager.insert(ReviewHelpful, {
        userId,
        reviewId,
      });

      await queryRunner.commitTransaction();

      return identifiers[0].id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`DB ERROR - ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
