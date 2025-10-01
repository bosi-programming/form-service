import { z } from 'zod';

import { applyRequiredValidation } from './applyRequiredValidation';
import { Field } from './types';
import { emptyStringToUndefined } from './utils';

export const numberValidator = (field: Field) => {
  const min = Number(field.min);
  const max = Number(field.max);
  const unprocessedSchema = z
    .number({
      error: 'Required',
    })
    .min(min || 0, { message: `Must be at least ${min}` })
    .max(max || 200, { message: `Must be at most ${max}` });

  const schema = z
    .preprocess((val: unknown) => {
      if (val === '') {
        return undefined;
      }

      if (
        typeof val === 'number' ||
        typeof val === 'boolean' ||
        val === null ||
        val === undefined
      ) {
        return val;
      }

      const numberVal = Number(val);
      if (typeof numberVal === 'number' && !isNaN(numberVal)) {
        return numberVal;
      }

      return val;
    }, unprocessedSchema)
    .optional()
    .or(emptyStringToUndefined);

  return applyRequiredValidation(schema, field);
};
