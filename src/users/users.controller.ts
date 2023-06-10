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
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReviewsService } from 'src/reviews/reviews.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

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
  async deleteReview(@Request() req, @Param('reviewId') reviewId: string) {
    const {
      user: { sub: userId },
    } = req;

    const isExists = await this.reviewsService.checkReview(reviewId);

    if (!isExists) {
      throw new NotFoundException('Review not found');
    }

    const isOwner = await this.reviewsService.checkReviewOwner(
      userId,
      reviewId,
    );

    if (!isOwner) {
      throw new ForbiddenException('You are not owner of this review');
    }

    return await this.reviewsService.deleteReview(reviewId);
  }
}
