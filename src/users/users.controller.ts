import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TransactionManger } from 'src/transaction.interceptor';
import { EntityManager } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  postUser(@Body() userData: CreateUserDto) {
    return this.usersService.createUser(userData);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Delete('/reviews/:reviewId')
  async deleteReview(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @TransactionManger() dbManager: EntityManager,
  ) {
    const {
      user: { sub: userId },
    } = req;

    const isOwner = await this.usersService.checkReviewOwner(
      userId,
      reviewId,
      dbManager,
    );

    if (!isOwner) {
      throw new ForbiddenException('You are not owner of this review');
    }

    return await this.usersService.deleteReview(reviewId, dbManager);
  }
}
