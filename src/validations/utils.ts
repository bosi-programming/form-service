import { z, type ZodDate } from 'zod';
import { Field } from './types';

export const emptyStringToUndefined = z.literal('').transform(() => undefined);

export const addMaxDateMinAgeValidation = (schema: ZodDate, field: Field) => {
  const maxDate = field.maxDate;
  const minAge = field.minAge;

  if (minAge) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - minAge);
    return schema.max(date, {
      message: `Must be at least ${minAge} years old`,
    });
  }
  if (maxDate) {
    if (maxDate === 'CURRENT_DATE') {
      return schema.max(new Date(), {
        message: 'This must not be a future date',
      });
    }
    if (maxDate === 'FUTURE_DATE') {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 100);
      return schema.max(futureDate, {
        message: `Please enter a valid expiration date within 100 years`,
      });
    }
    const dateToValidate = new Date(maxDate);
    return schema.max(dateToValidate, {
      message: `Must be older than ${dateToValidate.toLocaleDateString()}`,
    });
  }
  return schema;
};

export const addMinDateMaxAgeValidation = (schema: ZodDate, field: Field) => {
  const minDate = field.minDate;
  const maxAge = field.maxAge;

  if (maxAge) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - maxAge - 1);
    date.setDate(date.getDate() - 1);
    return schema.min(date, {
      message: `Must be at most ${maxAge} years old`,
    });
  }

  if (minDate) {
    if (minDate === 'CURRENT_DATE') {
      return schema.min(new Date(), {
        message: 'This date needs to be set in the future',
      });
    }
    const dateToValidate = new Date(minDate);
    return schema.min(dateToValidate, {
      message: `Must be newer than ${dateToValidate.toLocaleDateString()}`,
    });
  }
  return schema;
};
