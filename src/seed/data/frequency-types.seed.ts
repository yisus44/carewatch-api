import { CreateFrequencyTypeDto } from 'src/frequency-types/dto/create-frequency-type.dto';
import { FrequencyTypeEnum } from 'src/frequency-types/entities/frequency-type.entity';

export const frequencyTypesSeed: CreateFrequencyTypeDto[] = [
  {
    name: FrequencyTypeEnum.SECOND,
    details: 'seconds',
    format: '1',
  },
  {
    name: FrequencyTypeEnum.MINUTE,
    details: 'minutes',
    format: '60',
  },
  {
    name: FrequencyTypeEnum.HOUR,
    details: 'hours',
    format: '3600',
  },
  {
    name: FrequencyTypeEnum.DAY,
    details: 'days',
    format: '86400',
  },
  {
    name: FrequencyTypeEnum.SPECIFC_WEEKDAY,
    details: 'A specific day of the week',
    format: 'L, M, MR, J,V,S,D',
  },
  {
    name: 'date',
    details: FrequencyTypeEnum.SPECIFC_DATE,
    format: 'xxxx-xx-xx',
  },
];
