import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Cinema } from './cinema.entity';

@Entity('purchase_seat')
export class PurchaseSeat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  seats: number;

  @Column({ type: 'integer' })
  seatNumber: number;

  @ManyToOne(() => Cinema)
  @JoinColumn({ name: 'cinemaId' })
  cinema: Cinema;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
