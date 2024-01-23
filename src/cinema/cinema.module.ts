import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';
import { Cinema } from './cinema.entity';
import { PurchaseSeat } from './purchase_seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema, PurchaseSeat])],
  controllers: [CinemaController],
  providers: [CinemaService],
})
export class CinemaModule {}