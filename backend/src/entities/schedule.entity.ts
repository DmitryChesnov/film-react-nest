import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'film_id' })
  film_id: string;

  @Column()
  daytime: string;

  @Column()
  hall: string;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column('text', { array: true, default: [] })
  taken: string[];

  @Column()
  price: number;

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'film_id' })
  film: Film;
}
