import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Cinema } from './cinema.entity';
import { CreateCinemaDto, PurchaseSeatDto } from './cinema.dto';
import { PurchaseSeat } from './purchase_seat.entity';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private cinemaRepository: Repository<Cinema>,
    @InjectRepository(PurchaseSeat)
    private purchaseSeatRepository: Repository<PurchaseSeat>,
  ) {}

  async createCinema(createCinameDto: CreateCinemaDto) {
    const cinema = this.cinemaRepository.create(createCinameDto);
    return this.cinemaRepository.save(cinema);
  }

  async seatPurchase(purchaseSeatDto: PurchaseSeatDto) {
    const cinema = await this.cinemaRepository.findOne({
      where: { id: purchaseSeatDto.cinemaId },
    });
    if (!cinema) throw new NotFoundException('Cinema not found');

    const startSeat = purchaseSeatDto.seatNumber;
    const endSeat = purchaseSeatDto.seatNumber + purchaseSeatDto.seats - 1;
    const seat = await this.purchaseSeatRepository
      .createQueryBuilder('purchase_seat')
      .select('id')
      .where({ cinema: { id: purchaseSeatDto.cinemaId } })
      .andWhere(
        '(seatNumber BETWEEN :startSeat AND :endSeat OR seatNumber + seats - 1 BETWEEN :startSeat AND :endSeat)',
      )
      .andWhere('deletedAt IS NULL')
      .setParameters({ startSeat, endSeat })
      .limit(1)
      .getRawOne();

    if (seat) {
      throw new ConflictException('Seats are already Purchased');
    }

    const purchaseSeat = new PurchaseSeat();
    purchaseSeat.cinema = cinema;
    purchaseSeat.seats = purchaseSeatDto.seats;
    purchaseSeat.seatNumber = purchaseSeatDto.seatNumber;
    await this.purchaseSeatRepository.save(purchaseSeat);
    return purchaseSeat.seats;
  }

  async isContinuousBlockAvailable(
    cinemaId: string,
    startingSeatNumber: number,
    numberOfSeats: number,
  ): Promise<boolean> {
    const occupiedSeats = await this.purchaseSeatRepository.find({
      where: {
        cinema: { id: cinemaId },
        seatNumber: startingSeatNumber,
      },
    });

    for (let i = 0; i < numberOfSeats; i++) {
      const seatNumberToCheck = startingSeatNumber + i;
      const seatOccupied = occupiedSeats.some(
        (seat) => seat.seatNumber === seatNumberToCheck,
      );

      if (seatOccupied) {
        return false;
      }
    }

    return true;
  }
}
