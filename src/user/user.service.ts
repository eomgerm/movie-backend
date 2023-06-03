import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

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
      throw new InternalServerErrorException('DB ERROR');
    } finally {
      await queryRunner.release();
    }
  }

  async findbyEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }
}
