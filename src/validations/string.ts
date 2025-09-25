import { z } from 'zod';

import { applyRequiredValidation } from './applyRequiredValidation';
import { Field } from './types';
import { emptyStringToUndefined } from './utils';

export const stringValidator = (field: Field) => {
  const min = Number(field.min);
  const max = Number(field.max);

  const schema = z
    .string()
    .trim()
    .min(min, {
      message: `This field needs to have at least ${min} characters`,
    })
    .max(max, {
      message: `This field can't have more than ${max} characters`,
    })
    .optional()
    .or(emptyStringToUndefined);

  return applyRequiredValidation(schema, field);
};
