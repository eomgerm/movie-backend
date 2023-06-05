import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly reservationService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post(':schedule_id')
  postReservation(@Param('schedule_id') scheduleId: string, @Request() req, @Body()) {
    const {
      user: { sub: userId },
    } = req;

    if (!userId) {
      return new UnauthorizedException('You are not logged in!');
    }

    return this.reservationService.createBooking(scheduleId, userId);
  }
}
