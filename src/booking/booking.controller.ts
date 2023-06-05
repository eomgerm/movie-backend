import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookingDto } from './dto/bookingDto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post(':schedule_id')
  postReservation(
    @Param('schedule_id') scheduleId: string,
    @Request() req,
    @Body() bookingData: BookingDto,
  ) {
    const {
      user: { sub: userId },
    } = req;

    return this.bookingService.createBooking(
      scheduleId,
      userId,
      bookingData.seats,
    );
  }
}
