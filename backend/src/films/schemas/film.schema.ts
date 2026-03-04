import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ScheduleItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  daytime: string;

  @Prop({ required: true })
  hall: string; // Изменено на string для соответствия коллекции Postman

  @Prop({ required: true })
  rows: number;

  @Prop({ required: true })
  seats: number;

  @Prop({ type: [String], default: [] })
  taken: string[];

  @Prop({ required: true })
  price: number;
}

@Schema()
export class Film extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [ScheduleItem], default: [] })
  schedule: ScheduleItem[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);

// Добавляем индексы для оптимизации запросов
FilmSchema.index({ id: 1 }); // Индекс для поиска по id
FilmSchema.index({ 'schedule.id': 1 }); // Индекс для поиска по schedule.id
