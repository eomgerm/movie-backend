import { IsArray, Matches } from 'class-validator';

export class BookingDto {
  @IsArray()
  @Matches(/[A-Z]((0[1-9])|[1-9][0-9])$/, { each: true })
  seats: string[];
}
