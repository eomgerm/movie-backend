import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { Users } from 'src/entities/Users';
import { DataSource } from 'typeorm';
import { ReviewHelpful } from 'src/entities/ReviewHelpful';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}
  async createUser(userData: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const {
        email,
        password,
        name,
        username,
        mobile,
        birthDate,
        gender,
        profileUrl,
      } = userData;

      const isUserExists = await this.findbyEmail(email);
      if (isUserExists) {
        throw new ForbiddenException('Email already exists');
      }
      const insertUserQuery = `
      insert into users(email, password, name, username, mobile, birth_date, gender, profile_url) 
      values(${email}, ${password}, ${name}, ${username}, ${mobile}, ${birthDate}, ${gender}, ${profileUrl})}
      `;

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
    try {
      await queryRunner.connect();

      const selectUserQuery = `select * from users where email = ${email}`;
      const [queryResult] = await queryRunner.manager.query(selectUserQuery);

      return queryResult;
    } catch (error) {
      throw new InternalServerErrorException(`DB ERROR - ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async createReviewHelpful(userId: string, reviewId: string) {
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

  async deleteReviewHelpful(userId: string, reviewId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.delete(ReviewHelpful, {
        userId,
        reviewId,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`DB ERROR - ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findReviewHelpful(reviewId: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();

      const helpful = await queryRunner.manager.findOne(ReviewHelpful, {
        where: { reviewId, userId },
      });

      return helpful;
    } catch (error) {
      throw new InternalServerErrorException(`DB ERROR - ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
