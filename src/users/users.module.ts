import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ReviewsService } from 'src/reviews/reviews.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ReviewsService],
  exports: [UsersService],
})
export class UsersModule {}
