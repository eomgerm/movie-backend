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
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookingDto } from './dto/bookingDto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

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
