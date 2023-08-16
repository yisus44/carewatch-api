import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidTime', async: false })
export class IsValidTimeConstraint implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    return /^(1[0-2]|0?[1-9]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(time); // Validates HH:mm:ss format
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid time format';
  }
}
