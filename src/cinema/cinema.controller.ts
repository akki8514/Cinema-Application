import { Controller, Post, Body, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto, PurchaseSeatDto } from './cinema.dto';

@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Post('create')
  async createCinema(@Body() createCinemaDto: CreateCinemaDto) {
    return await this.cinemaService.createCinema(createCinemaDto);
  }

  @Post('seat-purchase')
  async purchaseSeat(@Body() purchaseSeatDto: PurchaseSeatDto) {
    return await this.cinemaService.seatPurchase(purchaseSeatDto);
  }
}