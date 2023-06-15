import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Body,
  Delete,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookingDto } from './dto/bookingDto';
import { ApiTags } from '@nestjs/swagger';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @ApiTags('bookings')
  @UseGuards(AuthGuard)
  @Post(':scheduleId')
  async postBooking(
    @Param('scheduleId') scheduleId: string,
    @Request() req,
    @Body() bookingData: BookingDto,
  ) {
    const {
      user: { sub: userId },
    } = req;

    console.log(req.user);

    const isOccupied = await this.bookingService.validateSeats(
      scheduleId,
      bookingData.seats,
    );

    if (isOccupied) {
      throw new BadRequestException('Seats are not available');
    }

    return await this.bookingService.createBooking(
      scheduleId,
      userId,
      bookingData.seats,
    );
  }

  @ApiTags('bookings')
  @UseGuards(AuthGuard)
  @Delete(':scheduleId/:bookingId')
  async deleteBooking(@Param('bookingId') bookingId: string, @Request() req) {
    const {
      user: { sub: userId },
    } = req;

    const isOwner = this.bookingService.validateOwner(bookingId, userId);
    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this booking');
    }

    return this.bookingService.deleteBooking(bookingId);
  }
}
