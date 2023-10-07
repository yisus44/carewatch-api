import { CreateWeekDayDto } from '../../week-days/dto/create-week-day.dto';

export const weekDaysSeed: CreateWeekDayDto[] = [
  { name: 'Domingo', weekDayNumber: 0 },
  {
    name: 'Lunes',
    weekDayNumber: 1,
  },
  {
    name: 'Martes',
    weekDayNumber: 2,
  },
  {
    name: 'Miércoles',
    weekDayNumber: 3,
  },
  { name: 'Jueves', weekDayNumber: 4 },
  { name: 'Viernes', weekDayNumber: 5 },
  { name: 'Sábado', weekDayNumber: 6 },
];
