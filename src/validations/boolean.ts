import { z } from 'zod';

import { applyRequiredValidation } from './applyRequiredValidation';
import { Field } from './types';

export const booleanValidator = (field: Field) => {
  const schema = z.preprocess((val: unknown) => {
    if (val === 'false') {
      return false;
    }
    if (val === 'true') {
      return true;
    }
    return val;
  }, z.boolean());

  return applyRequiredValidation(schema, field);
};
