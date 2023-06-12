import { ApiProperty } from '@nestjs/swagger';
import { IsArray, Matches } from 'class-validator';

export class BookingDto {
  @ApiProperty({
    example: 'A12',
    pattern: '[A-Z]((0[1-9])|[1-9][0-9])$',
    description: 'Seat Number for Booking',
  })
  @IsArray()
  @Matches(/[A-Z]((0[1-9])|[1-9][0-9])$/, { each: true })
  seats: string[];
}
