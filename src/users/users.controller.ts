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
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreateReviewHelpfulDto } from './dto/createReviewHelpful';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @ApiTags('users')
  @Post()
  async postUser(@Body() userData: CreateUserDto) {
    const isUserExists = await this.usersService.findbyEmail(userData.email);
    if (isUserExists) {
      throw new ForbiddenException('Email already exists');
    }

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

    const isExists = await this.reviewsService.findReviewById(reviewId);

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

  @ApiTags('review-helpful')
  @UseGuards(AuthGuard)
  @Post('/review_helpful')
  async postHelpfulReview(
    @Request() req,
    @Body() helpfulReview: CreateReviewHelpfulDto,
  ) {
    const {
      user: { sub: userId },
    } = req;

    const { reviewId } = helpfulReview;

    const review = await this.reviewsService.findReviewById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const isReviewHelpful = await this.usersService.findReviewHelpful(
      reviewId,
      userId,
    );

    if (isReviewHelpful) {
      throw new BadRequestException('You already helpfuled this review');
    }

    return await this.usersService.createReviewHelpful(userId, reviewId);
  }

  @ApiTags('review-helpful')
  @UseGuards(AuthGuard)
  @Delete('/review_helpful/:review_id')
  async deleteHelpfulReview(
    @Request() req,
    @Param('review_id') reviewId: string,
  ) {
    const {
      user: { sub: userId },
    } = req;

    const review = await this.reviewsService.findReviewById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const isReviewHelpful = await this.usersService.findReviewHelpful(
      reviewId,
      userId,
    );

    if (!isReviewHelpful) {
      throw new BadRequestException("You didn't helpfuled this review");
    }

    return await this.usersService.deleteReviewHelpful(userId, reviewId);
  }
}
