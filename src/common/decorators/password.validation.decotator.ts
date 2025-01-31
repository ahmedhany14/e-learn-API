import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';


interface T {
    password: string;
}

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatching implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments) {
        const object = args.object as T;
        return confirmPassword === object.password; // Compare confirmPassword with password
    }

    defaultMessage(args: ValidationArguments) {
        return 'Passwords do not match'; // Custom error message
    }
}
