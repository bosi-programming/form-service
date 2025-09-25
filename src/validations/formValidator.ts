import z, { ZodObject, ZodType } from 'zod';
import { Field } from './types';
import { numberValidator } from './number';
import { stringValidator } from './string';
import { booleanValidator } from './boolean';
import { phoneValidator } from './phone';
import { dateValidator } from './date';
import { emailValidator } from './email';
import { validateRequired } from './applyRequiredValidation';

const zodValidators = {
  number: numberValidator,
  string: stringValidator,
  boolean: booleanValidator,
  phone: phoneValidator,
  date: dateValidator,
  email: emailValidator,
};

export const formValidator = (fields: Field[]) => {
  const validators = fields.reduce((acc, current) => {
    const currentKeyArray = current.key.split('.');
    const isCurrentFieldObject = currentKeyArray.length > 1;
    const currentValidator = zodValidators[current.validator](current);

    if (isCurrentFieldObject) {
      const currentObjectExist = !!acc[currentKeyArray[0] as keyof typeof acc];
      return {
        ...acc,
        [currentKeyArray[0]]: currentObjectExist
          ? (
              acc[currentKeyArray[0] as keyof typeof acc] as ZodObject<
                Record<string, ZodType>
              >
            ).extend({ [currentKeyArray[1]]: currentValidator })
          : z.object({ [currentKeyArray[1]]: currentValidator }),
      };
    }

    return {
      ...acc,
      [currentKeyArray[0]]: currentValidator,
    };
  }, {});

  // TODO: Replace for getNestedValue from utils/getNestedValue
  const getNestedValue = (
    obj: Record<string, unknown>,
    key: string,
  ): unknown => {
    const keys = key.split('.');
    const currentKey = keys[0];

    if (keys.length === 1) return obj[currentKey];

    return getNestedValue(
      obj[currentKey] as Record<string, unknown>,
      keys.slice(1).join('.'),
    );
  };

  const addValidationIssue = (
    ctx: z.RefinementCtx,
    key: string,
    message: string,
  ): void => {
    ctx.addIssue({
      code: 'custom',
      path: [key],
      message,
    });
  };

  return z
    .object(validators)
    .superRefine((data: Record<string, unknown>, ctx) => {
      fields.forEach((field) => {
        const isFieldRequired = field.required;

        if (!isFieldRequired) {
          return;
        }

        const fieldValue = getNestedValue(data, field.key);
        const isValidValue = validateRequired(fieldValue);

        if (!isValidValue) {
          addValidationIssue(ctx, field.key, 'Required');
        }
      });
    });
};
