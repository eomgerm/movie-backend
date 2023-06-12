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
import { CreateHelpfulReviewDto } from './dto/createHelpfulReviewDto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @ApiTags('users')
  @Post()
  postUser(@Body() userData: CreateUserDto) {
    return this.usersService.createUser(userData);
  }

  @ApiTags('users')
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiTags('reviews')
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

  @ApiTags('reviews')
  @UseGuards(AuthGuard)
  @Post('/helpful_reviews')
  async postHelpfulReview(
    @Request() req,
    @Body() helpfulReview: CreateHelpfulReviewDto,
  ) {
    const {
      user: { sub: userId },
    } = req;

    const { reviewId } = helpfulReview;

    const isExists = await this.reviewsService.checkReview(reviewId);

    if (!isExists) {
      throw new NotFoundException('Review not found');
    }

    return await this.usersService.createHelpfulReview(userId, reviewId);
  }
}
