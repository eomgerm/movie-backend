import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(private dataSource: DataSource) {}
  createBooking(scheduleId: string, userId: string) {
    try {
    } catch (error) {
    } finally {
    }
  }
}
