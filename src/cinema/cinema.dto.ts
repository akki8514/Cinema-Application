import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCinemaDto {
  @IsNotEmpty()
  @IsNumber()
  seats: number;
}

export class PurchaseSeatDto {
  @IsNotEmpty()
  @IsString()
  cinemaId: string;

  @IsNotEmpty()
  seatNumber: number;

  @IsNotEmpty()
  @IsNumber()
  seats: number;
}
