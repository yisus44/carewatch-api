import { CreateMedicineUnitDto } from '../../medicine-units/dto/create-medicine-unit.dto';

export const MediceUnitsSeed: CreateMedicineUnitDto[] = [
  {
    name: 'Pastilla',
    description: 'Forma sólida de medicamento comprimido en forma de tableta.',
  },
  {
    name: 'Mililitros',
    description:
      'Medida de volumen que se usa para líquidos y soluciones medicinales.',
  },
  {
    name: 'Supositorio',
    description:
      'Medicamento en forma sólida que se introduce en el recto o la vagina para su absorción.',
  },
  {
    name: 'Pomada',
    description:
      'Sustancia semisólida que se aplica tópicamente en la piel para tratar afecciones locales.',
  },
  {
    name: 'Inhalador',
    description:
      'Dispositivo que administra medicamentos en forma de aerosol para su inhalación.',
  },
];
