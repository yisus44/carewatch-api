import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidTime', async: false })
export class IsValidTimeConstraint implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    return /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time); // Validates HH:mm:ss format
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid time format';
  }
}
