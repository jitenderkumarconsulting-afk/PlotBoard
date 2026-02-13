import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom decorator to validate if at least one property of the object is defined.
 * @param validationOptions Optional validation options.
 * @returns The decorator function.
 */
export function IsAtLeastOnePropertyDefined(
  validationOptions?: ValidationOptions,
) {
  // The decorator function that will be executed on the class property.
  return function (object: Record<string, any>, propertyName: string) {
    // Register the decorator using the provided options.
    registerDecorator({
      name: 'isAtLeastOnePropertyDefined', // Name of the decorator
      target: object.constructor, // The class constructor function
      propertyName: '_isAtLeastOnePropertyDefined', // Private property to trigger validation
      options: validationOptions, // Optional validation options
      validator: {
        // Validator function that checks if at least one property is defined
        validate(value: any, args: ValidationArguments) {
          const obj = args.object;

          // Check if the object is not null, not undefined, and has at least one property
          return (
            obj !== null && obj !== undefined && Object.keys(obj).length > 0
          );
        },
        // Default error message when validation fails
        defaultMessage(args: ValidationArguments) {
          return `At least one property should be defined.`;
        },
      },
    });
  };
}
